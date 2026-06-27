import { Star, type LucideIcon } from "lucide-react";

/**
 * ============================================================================
 * RECOMMENDATION CARD COMPONENT
 * ============================================================================
 *
 * A reusable, attractive component for displaying quiz recommendations
 * from different algorithms with subcategory support.
 *
 * Handles:
 * - Multiple recommendation algorithms (A-Priori, Content-Based, Collaborative, Hybrid, Popularity)
 * - Different API response structures
 * - Loading states
 * - Subcategory display (subcategory vs subCategory naming)
 * - Accuracy percentages
 * - Clickable items with auto-fill functionality
 *
 * ============================================================================
 */

interface RecommendationItem {
  category: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id?: string;
    name: string;
  };
  subCategory?: {
    _id?: string;
    name: string;
  };
  accuracy?: number;
  score?: number;
}

interface RecommendationCardProps {
  /** Card title (e.g., "Recommended for You") */
  title: string;

  /** Card description text */
  description: string;

  /** Array of recommendation items to display */
  items?: RecommendationItem[];

  /** Lucide Icon component to display */
  icon: LucideIcon;

  /** Tailwind gradient classes (e.g., "from-blue-50 to-cyan-50") */
  gradient: string;

  /** Show loading state if true */
  isLoading: boolean;

  /** Callback when a recommendation item is clicked */
  onItemClick?: (item: RecommendationItem) => void;

  /** Optional CSS classes for custom styling */
  className?: string;

  /** Maximum number of items to display (default: 3) */
  maxItems?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  items = [],
  icon: Icon,
  gradient,
  isLoading,
  onItemClick,
  className = "",
  maxItems = 3,
}) => {
  // Don't render if loading or no items
  if (isLoading || !items?.length) {
    return null;
  }

  // Slice items to max display count
  const displayItems = items.slice(0, maxItems);

  return (
    <div
      className={`
        rounded-xl border p-4 space-y-3
        bg-linear-to-br ${gradient}
        shadow-sm hover:shadow-md transition-shadow
        ${className}
      `}
    >
      {/* ===== HEADER WITH ICON AND TITLE ===== */}
      <h2 className="font-semibold flex items-center gap-2 text-base md:text-lg">
        <Icon size={18} className="shrink-0" />
        {title}
      </h2>

      {/* ===== DESCRIPTION ===== */}
      <p className="text-sm opacity-80">{description}</p>

      {/* ===== RECOMMENDATION ITEMS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayItems.map((item: RecommendationItem) => (
          <RecommendationItem
            key={item.category._id}
            item={item}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};

interface RecommendationItemProps {
  item: RecommendationItem;
  onItemClick?: (item: RecommendationItem) => void;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  item,
  onItemClick,
}) => {
  // Get subcategory with fallback for both naming conventions
  const subcategoryName = item.subcategory?.name || item.subCategory?.name;

  // Format the accuracy/score metric
  const getMetricDisplay = () => {
    if (item.accuracy !== undefined) {
      return `${item.accuracy.toFixed(1)}% accuracy`;
    }
    if (item.score !== undefined && typeof item.score === "number") {
      // For hybrid recommendations with scores between 0-1
      if (item.score < 1) {
        return `${(item.score * 100).toFixed(0)}% match`;
      }
      // For popularity scores
      return `${item.score} plays`;
    }
    return null;
  };

  const metricDisplay = getMetricDisplay();

  return (
    <div
      onClick={() => onItemClick?.(item)}
      className={`
        px-3 py-2 rounded-lg
        bg-white/60 backdrop-blur-sm
        hover:bg-white/80 transition-colors
        border border-white/40
        ${onItemClick ? "cursor-pointer" : ""}
        min-w-fit
      `}
    >
      {/* Category Name */}
      <div className="font-medium text-sm text-gray-900">
        Category: {item.category.name}
      </div>

      {/* Subcategory Name (if available) */}
      {subcategoryName && (
        <div className="text-xs opacity-75 text-gray-700">
          Subcategory: {subcategoryName}
        </div>
      )}

      {/* Accuracy/Score/Performance Metric (if available) */}
      {metricDisplay && (
        <div className="text-xs font-semibold text-green-600 mt-1">
          Accuracy: {metricDisplay}
        </div>
      )}
    </div>
  );
};
