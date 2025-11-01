"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS, categoryAPI, perfumeAPI } from "../../../lib/api";

function PerfumesPageInner() {
  const t = useTranslations("perfumes");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const isRTL = locale === "ar";
  const isDarkTheme = locale === "ar" || locale === "tr"; // Both Arabic and Turkish use dark theme

  const [perfumes, setPerfumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || "");

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    if (typeof textObj === "object" && textObj !== null) {
      return textObj[locale] || textObj.en || textObj.ar || textObj.tr || "";
    }
    return "";
  };

  // Helper function to update URL parameters
  const updateURLParams = (search, category) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Fetch perfumes with current filters
  const fetchPerfumes = async (
    searchValue = searchQuery,
    categoryValue = categorySlug
  ) => {
    try {
      setSearchLoading(true);

      // Build perfumes API parameters
      const params = {};
      if (categoryValue) params.category = categoryValue;
      if (searchValue) params.search = searchValue;

      // Fetch perfumes with filters
      const perfumesData = await perfumeAPI.getPerfumes(params);
      setPerfumes(perfumesData);
    } catch (err) {
      console.error("Error fetching perfumes:", err);
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    updateURLParams(searchTerm, selectedCategory);
    fetchPerfumes(searchTerm, selectedCategory);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle category change
  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    updateURLParams(searchTerm, categorySlug);
    fetchPerfumes(searchTerm, categorySlug);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    updateURLParams("", "");
    fetchPerfumes("", "");
  };

  // Helper function to get price display for a perfume
  const getPerfumePriceDisplay = (perfume) => {
    if (perfume.sizesPricing && perfume.sizesPricing.length > 0) {
      const prices = perfume.sizesPricing.map((sp) => sp.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return `₺${minPrice}`;
      } else {
        return `₺${minPrice} - ₺${maxPrice}`;
      }
    }
    // Fallback to old structure
    return `₺${perfume.price || 0}`;
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#e8b600]/10 animate-pulse">
      <div className="aspect-square bg-gray-700/20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent animate-shimmer"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700/30 rounded-lg w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700/20 rounded w-full"></div>
          <div className="h-4 bg-gray-700/20 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-700/30 rounded w-20"></div>
          <div className="w-8 h-8 bg-gray-700/20 rounded-full"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-700/20 rounded-full w-12"></div>
          <div className="h-6 bg-gray-700/20 rounded-full w-12"></div>
          <div className="h-6 bg-gray-700/20 rounded-full w-12"></div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesData = await categoryAPI.getCategories();
        setCategories(categoriesData);

        // Fetch category info if category slug is provided
        if (categorySlug) {
          const category = await categoryAPI.getCategory(categorySlug);
          setCurrentCategory(category);
        } else {
          setCurrentCategory(null);
        }

        // Fetch initial perfumes
        await fetchPerfumes();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update state when URL parameters change (browser back/forward)
  useEffect(() => {
    setSearchTerm(searchQuery);
    setSelectedCategory(categorySlug || "");
  }, [searchQuery, categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-[#e8b600] border-r-[#e8b600] mx-auto mb-8 shadow-lg shadow-[#e8b600]/20"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-[#e8b600]/30 border-l-[#e8b600]/30 animate-pulse"></div>
            <div
              className="absolute inset-2 rounded-full h-16 w-16 border-2 border-transparent border-t-[#f4c430]/50 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "3s" }}
            ></div>
          </div>
          <p className="text-gray-300 text-xl font-light tracking-wide mb-4">
            Loading perfumes...
          </p>
          <div className="mt-4 w-40 h-1 bg-gradient-to-r from-transparent via-[#e8b600] to-transparent mx-auto animate-pulse rounded-full"></div>
          <div className="mt-6 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#e8b600] rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-black from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30 shadow-lg shadow-red-500/20">
              <i className="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">
            Oops! Something went wrong
          </h3>
          <p className="text-red-300 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-[#e8b600] to-[#d4a500] text-black rounded-full font-semibold hover:from-[#d4a500] hover:to-[#c19400] transition-all duration-300 shadow-lg shadow-[#e8b600]/25 hover:shadow-[#e8b600]/40 transform hover:scale-105"
          >
            <i className="fas fa-redo mr-2"></i>
            {t("retry") || "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black"></div>

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#e8b600]/5 filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-[#e8b600]/3 filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#e8b600]/2 filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#e8b600] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#e8b600] rounded-full animate-pulse delay-1000 opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#e8b600] rounded-full animate-pulse delay-2000 opacity-50"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#e8b600] rounded-full animate-pulse delay-3000 opacity-30"></div>
          <div className="absolute bottom-1/2 right-2/3 w-2 h-2 bg-[#e8b600] rounded-full animate-pulse delay-4000 opacity-40"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1
            className={`text-6xl md:text-8xl font-extralight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e8b600] via-[#f4c430] to-[#e8b600] tracking-wider ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {currentCategory
              ? getLocalizedText(currentCategory.name)
              : t("title")}
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-[#e8b600] to-transparent"></div>
          </div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-300 font-light tracking-wide">
            {currentCategory
              ? getLocalizedText(currentCategory.description)
              : t("subtitle")}
          </p>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 backdrop-blur-sm border border-[#e8b600]/20 rounded-3xl p-8 shadow-2xl shadow-[#e8b600]/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Search Input */}
              <div className="lg:col-span-7">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder={
                      t("searchPlaceholder") ||
                      "Search for your perfect fragrance..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-6 py-4 pl-14 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#e8b600]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#e8b600]/70 focus:shadow-lg focus:shadow-[#e8b600]/20 transition-all duration-300 group-hover:border-[#e8b600]/50"
                  />
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-search text-[#e8b600]/60 group-hover:text-[#e8b600] transition-colors duration-300"></i>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#e8b600] transition-colors duration-300"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#e8b600]/30 rounded-2xl text-white focus:outline-none focus:border-[#e8b600]/70 focus:shadow-lg focus:shadow-[#e8b600]/20 transition-all duration-300 appearance-none cursor-pointer hover:border-[#e8b600]/50"
                  >
                    <option value="">
                      {t("allCategories") || "All Categories"}
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {getLocalizedText(category.name)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-[#e8b600]/60"></i>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2">
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#e8b600] to-[#d4a500] text-black rounded-2xl font-semibold hover:from-[#d4a500] hover:to-[#c19400] transition-all duration-300 shadow-lg shadow-[#e8b600]/25 hover:shadow-[#e8b600]/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {searchLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-black mr-2"></div>
                      <span>{t("searching") || "Searching..."}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      <span>{t("search") || "Search"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters & Clear Button */}
            {(searchQuery || selectedCategory) && (
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#e8b600]/20">
                <span className="text-gray-400 text-sm font-medium">
                  {t("activeFilters") || "Active filters:"}
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8b600]/15 border border-[#e8b600]/40 rounded-full text-[#e8b600] text-sm shadow-sm">
                    <i className="fas fa-search text-xs"></i>
                    <span className="font-medium">"{searchQuery}"</span>
                  </span>
                )}

                {selectedCategory && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8b600]/15 border border-[#e8b600]/40 rounded-full text-[#e8b600] text-sm shadow-sm">
                    <i className="fas fa-tag text-xs"></i>
                    <span className="font-medium">
                      {getLocalizedText(
                        categories.find((cat) => cat.slug === selectedCategory)
                          ?.name
                      ) || selectedCategory}
                    </span>
                  </span>
                )}

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-400 hover:text-[#e8b600] transition-colors duration-300 text-sm font-medium group"
                >
                  <i className="fas fa-times mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
                  {t("clearFilters") || "Clear all"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {searchLoading ? (
          // Search Loading State with Skeletons
          <>
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#e8b600]/10 border border-[#e8b600]/30 rounded-full text-[#e8b600]">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-[#e8b600]"></div>
                <span className="font-medium">
                  {t("searchingPerfumes") || "Searching perfumes..."}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </>
        ) : perfumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-700/20 to-gray-800/20 flex items-center justify-center border border-gray-600/30 shadow-lg">
                <i className="fas fa-search text-gray-400 text-4xl"></i>
              </div>
            </div>
            <h3 className="text-2xl text-gray-300 font-light mb-4">
              {searchQuery || selectedCategory
                ? t("noResultsFound") || "No results found"
                : t("noProducts") || "No products available"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery || selectedCategory
                ? t("tryDifferentSearch") ||
                  "Try adjusting your search criteria or browse all products"
                : t("checkBackLater") || "Check back later for new arrivals"}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-8 py-4 bg-gradient-to-r from-[#e8b600] to-[#d4a500] text-black rounded-full font-semibold hover:from-[#d4a500] hover:to-[#c19400] transition-all duration-300 shadow-lg shadow-[#e8b600]/25 hover:shadow-[#e8b600]/40 transform hover:scale-105"
              >
                <i className="fas fa-th mr-2"></i>
                {t("showAllProducts") || "Show all products"}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count with animation */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#e8b600]/10 border border-[#e8b600]/20 rounded-full text-[#e8b600] animate-fadeIn">
                <i className="fas fa-check-circle text-sm"></i>
                <span className="font-medium">
                  {t("showingResults", { count: perfumes.length }) ||
                    `Found ${perfumes.length} product${
                      perfumes.length !== 1 ? "s" : ""
                    }`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {perfumes.map((perfume, index) => (
                <Link
                  href={`/perfume/${perfume.urlName}`}
                  key={perfume._id}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl transition-all duration-700 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#e8b600]/10 hover:border-[#e8b600]/30 backdrop-blur-sm shadow-2xl hover:shadow-[#e8b600]/20 transform hover:scale-105">
                    {/* Image container with enhanced effects */}
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={
                          perfume.image
                            ? `https://api.ardoreperfume.com/${perfume.image}`
                            : "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg"
                        }
                        alt={getLocalizedText(perfume.title)}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Hover icon */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#e8b600]/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 shadow-lg">
                        <i className="fas fa-arrow-right text-[#e8b600] text-sm"></i>
                      </div>

                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-light text-[#e8b600] mb-3 group-hover:text-[#f4c430] transition-colors duration-300 line-clamp-1">
                        {getLocalizedText(perfume.title)}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-2 text-gray-400 leading-relaxed">
                        {getLocalizedText(perfume.description)}
                      </p>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#e8b600] font-semibold text-lg">
                          {getPerfumePriceDisplay(perfume)}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-[#e8b600]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-0 group-hover:rotate-45 shadow-sm">
                          <i className="fas fa-plus text-[#e8b600] text-sm"></i>
                        </div>
                      </div>

                      {/* Enhanced size badges */}
                      {perfume.sizesPricing &&
                        perfume.sizesPricing.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {perfume.sizesPricing
                              .slice(0, 3)
                              .map((sizePrice, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gradient-to-r from-[#e8b600]/10 to-[#e8b600]/5 text-[#e8b600] px-3 py-1.5 rounded-full border border-[#e8b600]/20 hover:border-[#e8b600]/40 transition-colors duration-300 shadow-sm"
                                  title={`${sizePrice.size}ml - ₺${sizePrice.price}`}
                                >
                                  {sizePrice.size}ml
                                </span>
                              ))}
                            {perfume.sizesPricing.length > 3 && (
                              <span className="text-xs text-gray-400 px-3 py-1.5">
                                +{perfume.sizesPricing.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Enhanced border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#e8b600]/20 transition-all duration-500"></div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e8b600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#e8b600]/8 to-[#e8b600]/2 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-tl from-[#e8b600]/6 to-transparent filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#e8b600]/3 filter blur-3xl animate-pulse delay-4000"></div>

        {/* Additional ambient effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[#e8b600]/1 to-transparent"></div>
      </div>

      {/* Floating particles animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#e8b600] rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function PerfumesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-[#e8b600] border-r-[#e8b600] mx-auto mb-8 shadow-lg shadow-[#e8b600]/20"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-[#e8b600]/30 border-l-[#e8b600]/30 animate-pulse"></div>
              <div
                className="absolute inset-2 rounded-full h-16 w-16 border-2 border-transparent border-t-[#f4c430]/50 animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "3s",
                }}
              ></div>
            </div>
            <p className="text-gray-300 text-xl font-light tracking-wide mb-4">
              Loading perfumes...
            </p>
            <div className="mt-4 w-40 h-1 bg-gradient-to-r from-transparent via-[#e8b600] to-transparent mx-auto animate-pulse rounded-full"></div>
          </div>
        </div>
      }
    >
      <PerfumesPageInner />
    </Suspense>
  );
}
