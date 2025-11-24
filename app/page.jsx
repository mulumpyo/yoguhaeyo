import ScrollHeader from "@/components/scroll-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GithubLoginButton from "@/components/github-login-button"; 
import { Rocket, Star, ShieldCheck, Users } from "lucide-react";

export const revalidate = 0;

const MaxWidthWrapper = ({ children, className }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
);

const Home = async () => {

  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      
      <ScrollHeader />
      
      <section className="w-full py-20 md:py-32 lg:py-40 text-center flex items-center justify-center">
        <MaxWidthWrapper className="max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight">
              아이디어를 바로 <span className="text-primary">현실로</span> 만드는
              <br />협업 플랫폼, <span className="text-primary">yoguhaeyo</span>
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl/relaxed font-medium">
              복잡한 과정은 없애고, 목표로 빠르게 나아가도록 설계했어요.
            </p>
            <div className="flex justify-center pt-4">
              <GithubLoginButton 
                variant="default" 
                text="GitHub 계정으로 시작하기" 
                className="
                  py-6 text-lg font-semibold shadow-lg
                " 
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section id="features" className="w-full py-16 md:py-28 lg:py-36 bg-gray-50 scroll-mt-16">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-2xl font-extrabold tracking-tighter sm:text-3xl md:text-4xl">차별화된 핵심 기능</h2>
            <p className="max-w-[900px] text-gray-500 md:text-lg">
              복잡함은 빼고, 효율과 성과에만 집중하세요.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl items-stretch gap-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
            
            <Card className="flex flex-col items-start p-6 
              bg-white/70 backdrop-blur-sm border border-gray-200 
              shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl h-full"
            >
              <CardHeader className="p-0 mb-4 flex-none">
                <Rocket className="h-8 w-8 text-primary" />
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardTitle className="text-lg font-bold mb-1 h-10 flex items-center">빠른 시작</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-1">
                  프로젝트를 바로 만들고, 팀원들을 초대해서 곧바로 시작해보세요.
                </CardContent>
              </div>
            </Card>

            <Card className="flex flex-col items-start p-6 
              bg-white/70 backdrop-blur-sm border border-gray-200 
              shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl h-full">
              <CardHeader className="p-0 mb-4 flex-none">
                <Star className="h-8 w-8 text-primary" />
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardTitle className="text-lg font-bold mb-1 h-10 flex items-center">직관적인 UI</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-1">
                  누구나 쉽게 적응할 수 있는, 깔끔한 인터페이스를 경험해보세요.
                </CardContent>
              </div>
            </Card>

            <Card className="flex flex-col items-start p-6 
              bg-white/70 backdrop-blur-sm border border-gray-200 
              shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl h-full">
              <CardHeader className="p-0 mb-4 flex-none">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardTitle className="text-lg font-bold mb-1 h-10 flex items-center">안전한 협업</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-1">
                  프로젝트 진행 상황, 안전하고 효율적으로 쏙쏙 관리하고 기록할 수 있어요.
                </CardContent>
              </div>
            </Card>

            <Card className="flex flex-col items-start p-6 
              bg-white/70 backdrop-blur-sm border border-gray-200 
              shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl h-full">
              <CardHeader className="p-0 mb-4 flex-none">
                <Users className="h-8 w-8 text-primary" />
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardTitle className="text-lg font-bold mb-1 h-10 flex items-center">강력한 팀워크</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-1">
                  팀원들끼리 정보를 투명하고 빠르게 공유하면 시너지가 확 올라가요.
                </CardContent>
              </div>
            </Card>
          </div>
        </MaxWidthWrapper>
      </section>
      
      <footer className="w-full shrink-0 border-t bg-white">
        <MaxWidthWrapper className="flex flex-col gap-2 sm:flex-row py-8 items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">&copy; {currentYear} yoguhaeyo. All rights reserved.</p>
        </MaxWidthWrapper>
      </footer>
    </div>
  );
};

export default Home;