"use client";

interface Topic {
  id: number;
  topic: string;
}

interface Props {
  topics: Topic[];
  selectedTopic: number | null;
  setSelectedTopic: (id: number | null) => void;
  disabled?: boolean;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  setSelectedTopic,
  disabled,
}: Props) {
  return (
    <div className="relative">
      <select
        disabled={disabled}
        value={selectedTopic ?? ""}
        onChange={(e) =>
          setSelectedTopic(
            e.target.value ? Number(e.target.value) : null
          )
        }
        className="
          appearance-none
          w-44
          h-9
          rounded-full
          border-0
          bg-gradient-to-r
          from-[#5B6E24]
          via-[#6B7328]
          to-[#FFC107]
          px-3
          pr-10
          text-xs
          font-semibold
          text-white
          shadow-md
          outline-none
          transition-all
          duration-300
          hover:scale-[1.02]
          cursor-pointer
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >
        <option value="" className="bg-white text-[#24310F] dark:bg-[#171717] dark:text-white">
          All Topics
        </option>

        {topics.map((topic) => (
          <option
            key={topic.id}
            value={topic.id}
            className="bg-white text-[#24310F] dark:bg-[#171717] dark:text-white"
          >
            {topic.topic}
          </option>
        ))}
      </select>
    </div>
  );
}