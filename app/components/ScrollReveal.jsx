'use client';

import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0.2, duration = 0.6 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration, delay }}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
}
