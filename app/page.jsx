import { fetchApi } from "@/lib/api";
import GithubLoginButton from "@/components/GithubLoginButton";

export const revalidate = 0;

const Home = async () => {
  const server = await fetchApi("/api/status/db");
  const redis = await fetchApi("/api/status/redis");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">서버 렌더링 (SSR)</h2>

      <div className="mt-4 p-4 border rounded bg-white">
        <p>{server?.serverTime}</p>
        <p>{JSON.stringify(server, null, 2)}</p>
        <p>{redis?.status}</p>
        <p>{JSON.stringify(redis, null, 2)}</p>
      </div>

      <div className="mt-6">
        <GithubLoginButton />
      </div>
    </div>
  );
};

export default Home;