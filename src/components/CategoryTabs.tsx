interface CategoryTabsProps {
  onSelectCategory?: (cat: string) => void
}

const CategoryTabs = ({ onSelectCategory }: CategoryTabsProps) => {
  const categories = [
    {
      id: 'individual',
      title: 'For individual referrers',
      color: '#1F9D55',
      cubeColor: '#e6f7ee',
      cubeBorder: '#1F9D55',
    },
    {
      id: 'advisor',
      title: 'For CAs & advisors',
      color: '#2563EB',
      cubeColor: '#eff6ff',
      cubeBorder: '#2563EB',
    },
    {
      id: 'broker',
      title: 'For real estate brokers',
      color: '#7C3AED',
      cubeColor: '#f5f3ff',
      cubeBorder: '#7C3AED',
    },
  ]

  return (
    <section className="category-tabs">
      <div className="container">
        <div className="category-tabs-inner">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="category-tab-btn"
              onClick={() => onSelectCategory?.(cat.id)}
            >
              <div className="category-cube-wrap">
                {/* 3D Isometric Cube SVG */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
                    stroke={cat.cubeBorder}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill={cat.cubeColor}
                  />
                  <path
                    d="M20 4L34 12L20 20L6 12L20 4Z"
                    fill={cat.cubeColor}
                    stroke={cat.cubeBorder}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 20V36"
                    stroke={cat.cubeBorder}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 12L20 20L34 12"
                    stroke={cat.cubeBorder}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="category-tab-text">{cat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryTabs
