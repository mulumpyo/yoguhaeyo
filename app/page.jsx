import { fetchApi } from "@/lib/api";
import GithubLoginButton from "@/components/GithubLoginButton";

export const revalidate = 0;

const Home = async () => {
  // const server = await fetchApi("/api/status/db");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">서버 렌더링 (SSR)</h2>

      <div className="mt-6">
        <GithubLoginButton />
      </div>
    </div>
  );
};

export default Home;