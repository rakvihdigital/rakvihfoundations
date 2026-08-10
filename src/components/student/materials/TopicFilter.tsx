"use client";

interface Props {
  topics: string[];
  selectedTopic: string;
  onChange: (topic: string) => void;
  disabled?: boolean;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="w-[170px] -mt-1">
      <select
        disabled={disabled}
        value={selectedTopic}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          w-44
          h-9
          rounded-full
          border
          border-[#D9E2C2]
          dark:border-neutral-800
          bg-gradient-to-r
          from-[#5B6E24]
          via-[#6B7328]
          to-[#FFC107]
          px-3
          pr-10
          text-xs
          font-semibold
          text-white
          dark:text-black
          shadow-md
          outline-none
          transition-all
          duration-300
          hover:from-[#647B28]
          hover:via-[#77822E]
          hover:to-[#FFD54A]
          hover:shadow-lg
          focus:ring-2
          focus:ring-[#6B7328]/30
          dark:focus:ring-[#FFC107]/30
          cursor-pointer
          disabled:opacity-60
          disabled:cursor-not-allowed
          disabled:hover:from-[#5B6E24]
          disabled:hover:via-[#6B7328]
          disabled:hover:to-[#FFC107]
          disabled:hover:shadow-md
        "
      >
        <option value="All" className="bg-white text-[#24310F] dark:bg-[#171717] dark:text-white">
          All Topics
        </option>

        {topics.map((topic) => (
          <option
            key={topic}
            value={topic}
            className="bg-white text-[#24310F] dark:bg-[#171717] dark:text-white"
          >
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}