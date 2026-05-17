import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description }) => (
  <div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="w-16 h-16 rounded-[2px] bg-[#005600]/10 text-[#005600] flex items-center justify-center">
        <Construction size={28} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 max-w-md text-lg">{description}</p>
    </motion.div>
  </div>
);

export default PlaceholderPage;
