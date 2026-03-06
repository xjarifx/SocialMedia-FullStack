interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className={`sticky top-0 z-10 border-b border-white/15 bg-black/85 backdrop-blur-sm ${className}`}>
      <div className="flex divide-x divide-white/10 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-white/65 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Underline indicator */}
      <div className="relative h-1 bg-white/10">
        <div
          className="absolute top-0 h-full bg-blue-400 transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
