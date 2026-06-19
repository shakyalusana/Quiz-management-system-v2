import { USERAPI } from "@/api/userApi";

const PlayersPage = () => {
  const { data, isLoading, isError } = USERAPI.usePlayers();

  const players = data?.users || [];

  if (isLoading) {
    return (
      <div className="flex h-100 items-center justify-center">
        Loading players...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-100 items-center justify-center text-red-500">
        Failed to load players
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Players</h1>
        <p className="text-muted-foreground">Manage and monitor all players</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Rating</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Joined</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player: any) => (
              <tr
                key={player._id}
                className="border-b transition hover:bg-muted/30"
              >
                <td className="px-6 py-4 font-medium">{player.name}</td>

                <td className="px-6 py-4 text-muted-foreground">
                  {player.email}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {player.rating}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {player.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(player.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {players.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            No players found
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
