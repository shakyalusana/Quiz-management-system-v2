import Quiz from "../models/quiz.js";

/**
 * A-PRIORI ALGORITHM
 * Finds association rules between categories
 * Example: If user does Math → likely to do Physics
 */

export const aprioriRecommendation = async (userId) => {
  try {
    // ============ STEP 1: Get user's quiz history ============
    const userQuizzes = await Quiz.find({
      player: userId,
    })
      .populate("category")
      .lean();

    if (!userQuizzes.length) {
      return {
        recommendations: [],
        rules: [],
        message: "Not enough history",
        method: "apriori",
      };
    }

    // ============ STEP 2: Build category sequences ============
    // Group by date to find order of attempts
    const categorySequences = userQuizzes
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((q) => ({
        categoryId: q.category._id.toString(),
        categoryName: q.category.name,
        score: q.score,
        timestamp: q.createdAt,
      }));

    // ============ STEP 3: Find frequent itemsets (categories) ============
    // Calculate dynamic thresholds based on data size
    const minSupport = userQuizzes.length < 5 ? 0.1 : 0.3; // 10% for small datasets
    const categoryFrequency = {};

    categorySequences.forEach((item) => {
      const key = item.categoryId;
      categoryFrequency[key] = (categoryFrequency[key] || 0) + 1;
    });

    const totalTransactions = categorySequences.length;
    const frequentItems = {};

    Object.entries(categoryFrequency).forEach(([catId, count]) => {
      const support = count / totalTransactions;
      if (support >= minSupport) {
        frequentItems[catId] = { support, count };
      }
    });

    // ============ STEP 4: Generate association rules ============
    // Adjust confidence based on data size
    const minConfidence = userQuizzes.length < 5 ? 0.2 : 0.4; // 20% for small datasets
    const rules = [];

    // Find 2-itemsets (pairs of categories)
    const categoryNames = await Quiz.find()
      .distinct("category")
      .populate("category");

    const categoryMap = new Map();
    categoryNames.forEach((cat) => {
      if (cat) categoryMap.set(cat._id.toString(), cat.name);
    });

    // For each frequent item, find what comes after
    const sortedSequence = Object.keys(frequentItems);

    for (let i = 0; i < sortedSequence.length; i++) {
      const antecedent = sortedSequence[i];

      // Count how many times antecedent appears
      let antecedentCount = 0;
      const followingItems = {};

      for (let j = 0; j < categorySequences.length - 1; j++) {
        if (categorySequences[j].categoryId === antecedent) {
          antecedentCount++;

          // Look at what comes next
          const nextItem = categorySequences[j + 1].categoryId;
          followingItems[nextItem] = (followingItems[nextItem] || 0) + 1;
        }
      }

      if (antecedentCount === 0) continue;

      // Calculate confidence for each rule
      Object.entries(followingItems).forEach(([consequent, coOccurrence]) => {
        const confidence = coOccurrence / antecedentCount;

        if (confidence >= minConfidence && antecedent !== consequent) {
          const lift =
            coOccurrence /
            totalTransactions /
            ((frequentItems[antecedent]?.support || 0) *
              (frequentItems[consequent]?.support || 0));

          rules.push({
            antecedent: [antecedent],
            consequent: [consequent],
            support: coOccurrence / totalTransactions,
            confidence,
            lift,
            antecedentName: categoryMap.get(antecedent) || antecedent,
            consequentName: categoryMap.get(consequent) || consequent,
          });
        }
      });
    }

    // ============ STEP 5: Sort rules by confidence & lift ============
    rules.sort((a, b) => {
      const scoreA = a.confidence * (a.lift || 1);
      const scoreB = b.confidence * (b.lift || 1);
      return scoreB - scoreA;
    });

    // ============ STEP 6: Generate recommendations ============
    // Collect all consequents from user's recent category
    const userRecentCategories = userQuizzes
      .slice(-5) // Last 5 quizzes
      .map((q) => q.category._id.toString());

    const recommendations = new Set();

    // First: Try to use rules
    rules.forEach((rule) => {
      if (userRecentCategories.includes(rule.antecedent[0])) {
        recommendations.add(rule.consequentName);
      }
    });

    // If no specific rules match, use most confident rules
    if (recommendations.size === 0 && rules.length > 0) {
      rules.slice(0, 5).forEach((rule) => {
        recommendations.add(rule.consequentName);
      });
    }

    // ============ FALLBACK: If still no recommendations ============
    // When dataset is too small, recommend categories user hasn't tried yet
    if (recommendations.size === 0) {
      const categoriesTried = new Set(
        userQuizzes.map((q) => q.category._id.toString()),
      );

      const allCategories = await Quiz.find().distinct("category");

      const categoriesToTry = allCategories.filter(
        (catId) => !categoriesTried.has(catId.toString()),
      );

      // Get names for new categories
      const allCategoryDocs = await Quiz.find()
        .distinct("category")
        .populate("category");

      categoriesToTry.slice(0, 3).forEach((catId) => {
        const catDoc = allCategoryDocs.find(
          (c) => c?._id?.toString() === catId.toString(),
        );
        if (catDoc?.name) {
          recommendations.add(catDoc.name);
        }
      });
    }

    return {
      recommendations: Array.from(recommendations),
      rules: rules.slice(0, 10), // Top 10 rules
      frequentItems: Object.fromEntries(
        Object.entries(frequentItems).map(([key, val]) => [
          categoryMap.get(key) || key,
          val,
        ]),
      ),
      method: "apriori",
      metadata: {
        totalRulesFound: rules.length,
        minSupport,
        minConfidence,
        transactionCount: totalTransactions,
        datasetSize: "small" ? userQuizzes.length < 10 : "large",
        recommendationSource:
          rules.length > 0 ? "association-rules" : "fallback-new-categories",
      },
    };
  } catch (error) {
    console.error("Apriori Algorithm Error:", error);
    return {
      recommendations: [],
      rules: [],
      method: "apriori",
      error: error.message,
    };
  }
};

/**
 * ECLAT ALGORITHM (Alternative)
 * Uses depth-first search for faster itemset mining
 * Good for large datasets
 */
export const eclatRecommendation = async (userId) => {
  try {
    const userQuizzes = await Quiz.find({ player: userId })
      .populate("category")
      .lean();

    if (userQuizzes.length < 2) {
      return {
        recommendations: [],
        method: "eclat",
        message: "Not enough data",
      };
    }

    // Build vertical database (tidsets)
    const tidsets = {};
    const categoryMap = {};

    userQuizzes.forEach((quiz, idx) => {
      const catId = quiz.category._id.toString();
      const catName = quiz.category.name;

      if (!tidsets[catId]) {
        tidsets[catId] = {
          tids: new Set(),
          name: catName,
        };
        categoryMap[catId] = catName;
      }

      tidsets[catId].tids.add(idx);
    });

    // Mine patterns using ECLAT
    const minSupport = Math.ceil(userQuizzes.length * 0.3);
    const frequentPatterns = [];

    const eclat = (prefix, items) => {
      items.forEach((itemId, idx) => {
        const newPrefix = [...prefix, itemId];
        const support = tidsets[itemId].tids.size;

        if (support >= minSupport) {
          frequentPatterns.push({
            pattern: newPrefix,
            support,
            names: newPrefix.map((id) => categoryMap[id]),
          });

          const remainingItems = items.slice(idx + 1);
          eclat(newPrefix, remainingItems);
        }
      });
    };

    eclat([], Object.keys(tidsets));

    // Sort by support and generate recommendations
    frequentPatterns.sort((a, b) => b.support - a.support);

    const recommendations = new Set();
    frequentPatterns.slice(0, 5).forEach((pattern) => {
      pattern.names.forEach((name) => recommendations.add(name));
    });

    return {
      recommendations: Array.from(recommendations),
      frequentPatterns: frequentPatterns.slice(0, 10),
      method: "eclat",
    };
  } catch (error) {
    console.error("ECLAT Algorithm Error:", error);
    return {
      recommendations: [],
      method: "eclat",
      error: error.message,
    };
  }
};
