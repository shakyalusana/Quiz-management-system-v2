import { Trophy, Medal, Star } from "lucide-react";

import { LEADERBOARDAPI } from "@/api/leaderboardApi";

const LeaderboardPage = () => {
  const { data, isLoading, isError } = LEADERBOARDAPI.useLeaderboard();

  const leaderboard = data?.leaderboard || [];

  if (isLoading) {
    return (
      <div className="flex h-125 items-center justify-center">
        Loading leaderboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-125 items-center justify-center text-red-500">
        Failed to load leaderboard
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top performing players</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-4 text-left">Rank</th>

              <th className="px-4 py-4 text-left">Player</th>

              <th className="px-4 py-4 text-left">Rating</th>

              <th className="px-4 py-4 text-left">Quizzes</th>

              <th className="px-4 py-4 text-left">Avg Score</th>

              <th className="px-4 py-4 text-left">Win Rate</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((player: any) => (
              <tr key={player._id} className="border-t hover:bg-muted/20">
                <td className="px-4 py-4">
                  {player.rank === 1 && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}

                  {player.rank === 2 && (
                    <Medal className="h-5 w-5 text-gray-400" />
                  )}

                  {player.rank === 3 && (
                    <Star className="h-5 w-5 text-amber-600" />
                  )}

                  {player.rank > 3 && <span>{player.rank}</span>}
                </td>

                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">{player.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {player.email}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {player.rating}
                  </span>
                </td>

                <td className="px-4 py-4">{player.totalQuizzes}</td>

                <td className="px-4 py-4">
                  {Number(player.averageScore || 0).toFixed(1)}
                </td>

                <td className="px-4 py-4">
                  <span className="font-semibold text-green-600">
                    {Number(player.winRate || 0).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leaderboard.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            No leaderboard data found
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
