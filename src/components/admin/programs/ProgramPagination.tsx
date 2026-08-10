"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function ProgramPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-[#E8ECE5] dark:border-[#1E3A5F] bg-[#F8FAF5] dark:bg-[#081525] mt-4 rounded-b-3xl">
      
      <div className="text-xs text-[#6B7280]">
        Page <span className="font-medium text-[#24310F] dark:text-white">{currentPage}</span> of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] hover:bg-white dark:hover:bg-[#132238] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
          Previous
        </motion.button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > totalPages) return null;

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-2xl text-xs font-medium transition-all ${
                  pageNum === currentPage
                    ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white shadow-md"
                    : "border border-[#E8ECE5] dark:border-[#1E3A5F] hover:bg-[#F8FAF5] dark:hover:bg-[#132238]"
                }`}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] hover:bg-white dark:hover:bg-[#132238] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}