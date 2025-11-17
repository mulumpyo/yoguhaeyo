import ScrollHeader from "@/components/ScrollHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GithubLoginButton from "@/components/GithubLoginButton"; 
import { Rocket, Star, ShieldCheck, Users } from "lucide-react";
import Link from "next/link"; // Link component is necessary for navigation

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
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-[4.5rem] leading-tight">
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

      <section id="features" className="w-full py-16 md:py-28 lg:py-36 bg-gray-50">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">차별화된 핵심 기능</h2>
            <p className="max-w-[900px] text-gray-500 md:text-lg">
              복잡함은 줄이고, 효율과 성과에만 집중하세요.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl items-stretch gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            
            <Card className="flex flex-col items-start p-6 
              bg-white/70 backdrop-blur-sm border border-gray-200 
              shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl h-full"
            >
              <CardHeader className="p-0 mb-4 flex-none">
                <Rocket className="h-8 w-8 text-primary" />
              </CardHeader>
              <div className="flex flex-col justify-between">
                <CardTitle className="text-xl font-bold mb-2 h-10 flex items-center">빠른 시작</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-2">
                  빠르게 프로젝트를 생성하고 팀원을 초대하여 바로 시작할 수 있습니다.
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
                <CardTitle className="text-xl font-bold mb-2 h-10 flex items-center">직관적인 UI</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-2">
                  복잡한 학습 과정 없이, 모든 사용자가 쉽게 적응할 수 있는 깔끔한 인터페이스를 제공합니다.
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
                <CardTitle className="text-xl font-bold mb-2 h-10 flex items-center">안전한 협업</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-2">
                  프로젝트 진행 상황을 안전하게 관리하고 기록합니다.
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
                <CardTitle className="text-xl font-bold mb-2 h-10 flex items-center">강력한 팀워크</CardTitle>
                <CardContent className="p-0 text-sm text-gray-500 mt-2">
                  팀원 간의 투명한 정보 공유를 통해 시너지를 극대화합니다.
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