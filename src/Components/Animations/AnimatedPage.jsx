import {motion} from 'framer-motion';

export default function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -1000, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 1.2 , ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
