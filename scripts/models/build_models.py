"""Build Nihol's original agricultural GLB assets and matching studio posters.
Run with Blender 4.5 LTS: blender --background --python scripts/models/build_models.py
All modeled subjects are inanimate. No third-party meshes or textures are used.
"""
from pathlib import Path
import math
import random
import bpy
import numpy as np
from mathutils import Vector, noise

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'public' / 'models'
SOURCE = ROOT / 'design' / 'models'
random.seed(2016)


def material(name, color, roughness=.6, metal=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metal
    return mat


def textured(name, base, weave=False):
    mat = material(name, base, .93)
    size = 512
    rng = np.random.default_rng(2016)
    y, x = np.mgrid[0:size, 0:size]
    grain = rng.random((size, size))
    broad = (np.sin(x*.043 + np.sin(y*.073)*2) + np.cos(y*.039 + x*.015))/2
    variation = .65 + grain*.48 + broad*.16
    if weave:
        variation = .84 + .1*np.sin(x*math.pi/2) + .06*np.sin(y*math.pi/2)
    rgba = np.ones((size, size, 4), dtype=np.float32)
    for channel in range(3):
        rgba[:, :, channel] = np.clip(base[channel]*variation, 0, 1)
    image = bpy.data.images.new(name + '_albedo', width=size, height=size)
    image.pixels.foreach_set(rgba.ravel())
    image.pack()
    texture = mat.node_tree.nodes.new('ShaderNodeTexImage')
    texture.image = image
    mat.node_tree.links.new(texture.outputs['Color'], mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    return mat


def assign(obj, mat, smooth=True):
    obj.data.materials.append(mat)
    if smooth:
        for face in obj.data.polygons:
            face.use_smooth = True
    return obj


def mesh(name, vertices, faces, mat, smooth=False):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    assign(obj, mat, smooth)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.uv.smart_project(island_margin=.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    obj.select_set(False)
    return obj


def sphere(name, position, scale, mat, detail=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=detail, radius=1, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    assign(obj, mat)
    return obj


def cylinder(name, a, b, radius, mat, vertices=48):
    direction = Vector(b) - Vector(a)
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=direction.length, location=(Vector(a)+Vector(b))/2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    assign(obj, mat)
    bevel = obj.modifiers.new('Manufactured edge', 'BEVEL')
    bevel.width = min(.025, radius*.15)
    bevel.segments = 2
    return obj


def box(name, position, scale, mat, bevel=.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat, False)
    if bevel:
        mod = obj.modifiers.new('Soft edge', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
    return obj


def join(objects, name):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    objects[0].name = name
    bpy.ops.object.select_all(action='DESELECT')


def soil():
    materials = [textured('Organic topsoil', (.24,.13,.062)), textured('Loamy subsoil', (.37,.23,.13)), textured('Mineral parent material', (.50,.36,.22))]
    def height(x, y, level):
        irregular = noise.noise_vector(Vector((x*2.2,y*2.2,1)))[0]*.045
        if level == 0:
            return .55 + .075*math.cos(x*10) + irregular
        return [.55,.10,-.43,-.91][level] + .045*math.sin(x*3+y*1.4) + irregular*.4
    nx, ny = 52, 38
    for level, mat in enumerate(materials):
        vertices, faces = [], []
        for layer in (level, level+1):
            for j in range(ny+1):
                for i in range(nx+1):
                    x,y = -1.5+3*i/nx, -1.1+2.2*j/ny
                    vertices.append((x,y,height(x,y,layer)))
        count=(nx+1)*(ny+1)
        for j in range(ny):
            for i in range(nx):
                a=j*(nx+1)+i
                faces.append((a,a+1,a+nx+2,a+nx+1))
                faces.append((a+count,a+nx+1+count,a+nx+2+count,a+1+count))
        boundary=list(range(nx+1))+[j*(nx+1)+nx for j in range(1,ny+1)]+[ny*(nx+1)+i for i in range(nx-1,-1,-1)]+[j*(nx+1) for j in range(ny-1,0,-1)]
        for k,a in enumerate(boundary):
            b=boundary[(k+1)%len(boundary)]
            faces.append((a,b,b+count,a+count))
        mesh(['Topsoil / cultivated ridges','Subsoil / loam','Parent layer / mineral'][level],vertices,faces,mat)
    pebble = material('Natural grit',(.28,.23,.18),.95)
    pieces=[]
    for i in range(110):
        x,y=random.uniform(-1.44,1.44),random.uniform(-1.04,1.04)
        r=random.uniform(.018,.057)
        pieces.append(sphere('Surface aggregate',(x,y,height(x,y,0)+r*.4),(r,r*.8,r*.55),pebble,1))
    for i in range(36):
        x,z=random.uniform(-1.4,1.4),random.uniform(-.84,.2)
        r=random.uniform(.025,.075)
        pieces.append(sphere('Exposed stone',(x,-1.105,z),(r,r*.3,r*.65),pebble,1))
    join(pieces,'Soil aggregates and exposed mineral inclusions')


def tube(name, a, b, outer, inner, mat):
    count=64
    axis=(Vector(b)-Vector(a)).normalized()
    u=axis.cross(Vector((0,0,1)))
    if u.length<.1: u=axis.cross(Vector((0,1,0)))
    u.normalize(); v=axis.cross(u).normalized()
    vertices=[]
    for center,r in [(a,outer),(b,outer),(a,inner),(b,inner)]:
        for i in range(count):
            angle=i*2*math.pi/count
            vertices.append(Vector(center)+r*(u*math.cos(angle)+v*math.sin(angle)))
    faces=[]
    for i in range(count):
        j=(i+1)%count
        faces += [(i,j,count+j,count+i),(2*count+i,3*count+i,3*count+j,2*count+j),(i,2*count+i,2*count+j,j),(count+i,count+j,3*count+j,3*count+i)]
    return mesh(name,vertices,faces,mat,True)


def water():
    black=material('HDPE pipe / charcoal',(.035,.048,.043),.33)
    blue=material('Compression fitting / blue',(.018,.24,.55),.28)
    steel=material('Stainless fittings',(.55,.61,.62),.25,.75)
    liquid=material('Water / blue clearcoat',(.07,.48,.67),.12,.15)
    liquid.node_tree.nodes.get('Principled BSDF').inputs['Coat Weight'].default_value=.8
    soil_mat=textured('Irrigation soil',(.29,.19,.10))
    box('Cutaway ground', (0,0,-.80), (3.65,1.65,.32),soil_mat,.10)
    tube('Main irrigation pipe',(-1.75,0,.35),(1.45,0,.35),.20,.145,black)
    for center in (-1.10,.95):
        tube('Blue compression coupling',(center-.18,0,.35),(center+.18,0,.35),.285,.143,blue)
        for i in range(16):
            angle=i*math.tau/16
            r=.285
            cylinder('Coupling grip',(center-.13,math.cos(angle)*r,.35+math.sin(angle)*r),(center+.13,math.cos(angle)*r,.35+math.sin(angle)*r),.016,blue,8)
    cylinder('Valve stem',(-.3,0,.35),(-.3,0,.90),.09,steel)
    box('Valve lever',(.0,0,.94),(.95,.16,.10),blue,.04)
    tube('Drip outlet',(.48,-.12,.35),(.48,-.50,.35),.075,.046,black)
    cylinder('Emitter nozzle',(.48,-.49,.35),(.48,-.49,.13),.065,blue)
    for i in range(5):
        z=.04-i*.135
        sphere('Water drop',(.48,-.49,z),(.04,.04,.055),liquid,2)
    sphere('Water at soil surface',(.48,-.49,-.61),(.30,.24,.016),liquid,3)
    # Mechanical pressure gauge reinforces the assembly's real-world purpose.
    cylinder('Gauge stem',(-.65,0,.35),(-.65,0,.72),.045,steel)
    cylinder('Pressure gauge housing',(-.65,-.07,.83),(-.65,-.16,.83),.16,steel)
    face=material('Gauge dial',(.87,.89,.82),.7)
    cylinder('Gauge face',(-.65,-.165,.83),(-.65,-.174,.83),.136,face)
    cylinder('Gauge needle',(-.65,-.18,.83),(-.72,-.18,.91),.012,black,8)


def nutrition():
    sack=textured('Woven fertilizer sack',(.74,.69,.54),True)
    green=material('Sack green print',(.055,.20,.09),.75)
    ink=material('Printed lettering',(.03,.10,.05),.8)
    rim=material('Folded sack seam',(.59,.54,.41),.92)
    vertices,faces=[],[]
    rings,segments=28,80
    for j in range(rings+1):
        t=j/rings
        z=-.82+t*2.45
        width=.62+.19*math.sin(math.pi*t)-.13*t**7
        depth=.36+.14*math.sin(math.pi*t)
        for i in range(segments):
            a=i*math.tau/segments
            x=math.copysign(abs(math.cos(a))**.58,math.cos(a))*width
            y=math.copysign(abs(math.sin(a))**.58,math.sin(a))*depth
            wrinkle=.012*math.sin(a*13+t*32)+.009*math.sin(a*23-t*20)
            x+=math.cos(a)*wrinkle; y+=math.sin(a)*wrinkle
            vertices.append((x-.30,y+.15,z+.025*math.sin(a*5)*t**4))
    for j in range(rings):
        for i in range(segments):
            a=j*segments+i; b=j*segments+(i+1)%segments
            faces.append((a,b,b+segments,a+segments))
    faces.append(tuple(reversed(range(segments))))
    obj=mesh('Open woven fertilizer sack',vertices,faces,sack,True)
    obj.data.materials.append(green)
    for polygon in obj.data.polygons:
        if .25 < polygon.center.z < .55: polygon.material_index=1
    # A rounded folded rim follows the actual mouth rather than a floating ring.
    curve=bpy.data.curves.new('Rolled bag lip','CURVE'); curve.dimensions='3D'; curve.bevel_depth=.035; curve.bevel_resolution=3
    spline=curve.splines.new('POLY'); spline.points.add(segments-1)
    for i,point in enumerate(spline.points): point.co=(*vertices[rings*segments+i],1)
    spline.use_cyclic_u=True
    lip=bpy.data.objects.new('Rolled sack opening',curve); bpy.context.collection.objects.link(lip); lip.data.materials.append(rim)
    granule_materials=[material('Limestone granules',(.76,.74,.62),.88),material('Mineral granules',(.51,.42,.26),.84),material('Nutrient granules',(.56,.61,.44),.86)]
    groups=[[],[],[]]
    for i in range(230):
        a=random.uniform(0,math.tau); r=math.sqrt(random.random())
        x=-.30+math.cos(a)*r*.47; y=.15+math.sin(a)*r*.30
        z=1.52+.06*(1-r)+random.uniform(-.02,.02)
        size=random.uniform(.033,.057)
        groups[i%3].append(sphere('Bag contents',(x,y,z),(size,size*.9,size*.9),granule_materials[i%3],1))
    for i in range(145):
        a=random.uniform(0,math.tau); r=math.sqrt(random.random())
        x=.80+math.cos(a)*r*.65; y=-.25+math.sin(a)*r*.53
        z=-.79+.24*(1-r*r)
        size=random.uniform(.03,.055)
        groups[i%3].append(sphere('Spilled fertilizer',(x,y,z),(size,size,size*.85),granule_materials[i%3],1))
    for index,items in enumerate(groups): join(items,'Granular fertilizer '+str(index))
    # Physical text meshes are baked into the asset; no browser fonts are needed.
    for text,z,size in [('NPK',.95,.34),('FERTILIZER',.72,.115)]:
        curve=bpy.data.curves.new(text,'FONT'); curve.body=text; curve.align_x='CENTER'; curve.size=size; curve.extrude=.001
        obj=bpy.data.objects.new(text,curve); bpy.context.collection.objects.link(obj)
        obj.location=(-.30,-.36,z); obj.rotation_euler=(math.pi/2,0,0); curve.materials.append(ink)
        bpy.context.view_layer.objects.active=obj; obj.select_set(True); bpy.ops.object.convert(target='MESH'); obj.select_set(False)


def export_and_render(name, builder):
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    builder()
    # Apply modeled curves/modifiers for portable, self-contained GLB assets.
    bpy.ops.object.select_all(action='SELECT')
    for obj in list(bpy.context.selected_objects):
        bpy.context.view_layer.objects.active=obj
        if obj.type=='CURVE': bpy.ops.object.convert(target='MESH')
        for modifier in list(obj.modifiers): bpy.ops.object.modifier_apply(modifier=modifier.name)
    bpy.ops.export_scene.gltf(filepath=str(OUTPUT/(name+'.glb')),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
    scene=bpy.context.scene
    scene.render.engine='CYCLES'; scene.cycles.samples=32
    scene.cycles.use_denoising=True
    scene.render.resolution_x=900; scene.render.resolution_y=800; scene.render.resolution_percentage=100
    scene.world.color=(.20,.20,.20)
    scene.render.film_transparent=False
    scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.055,.078,.062,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
    ground=material('Studio floor',(.075,.105,.084),.88)
    min_z = min((obj.matrix_world @ Vector(corner)).z for obj in bpy.context.selected_objects if obj.type == 'MESH' for corner in obj.bound_box)
    box('Studio floor',(0,0,min_z-.05),(200,200,.1),ground,0)
    for pos,energy,size in [((-3,-4,7),1000,5),((4,-1,4),650,4),((0,4,5),1000,3)]:
        bpy.ops.object.light_add(type='AREA',location=pos)
        light=bpy.context.object; light.data.energy=energy; light.data.shape='DISK'; light.data.size=size
        light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
    camera_position={'soil':(4,-6,4),'water':(3,-6,3.2),'nutrition':(3,-7,3)}[name]
    bpy.ops.object.camera_add(location=camera_position)
    camera=bpy.context.object; camera.rotation_euler=(Vector((0,0,.1))-camera.location).to_track_quat('-Z','Y').to_euler(); camera.data.type='ORTHO'; camera.data.ortho_scale=4.8
    scene.camera=camera
    scene.view_settings.view_transform='AgX'
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/(name+'.blend')))
    scene.render.filepath=str(OUTPUT/(name+'.png'))
    bpy.ops.render.render(write_still=True)
    print('NIHOL_ASSET_COMPLETE',name,flush=True)


for name,builder in [('soil',soil),('water',water),('nutrition',nutrition)]:
    export_and_render(name,builder)
