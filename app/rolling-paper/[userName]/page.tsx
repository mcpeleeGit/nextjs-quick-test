import { notFound } from 'next/navigation';

interface RollingPaperPageProps {
  params: {
    userName: string;
  };
}

export default function RollingPaperPage({ params }: RollingPaperPageProps) {
  const { userName } = params;
  
  if (!userName) {
    notFound();
  }

  const decodedUserName = decodeURIComponent(userName);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            {decodedUserName}님의 롤링페이퍼
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-6xl mb-4">💌</div>
            <p className="text-lg text-gray-600 mb-6">
              {decodedUserName}님에게 따뜻한 메시지를 남겨보세요!
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>참고:</strong> 이 페이지는 카카오톡 공유 테스트용 페이지입니다. 
                실제 롤링페이퍼 기능을 구현하려면 추가 개발이 필요합니다.
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 px-6 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors">
                메시지 남기기
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                뒤로가기
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            공유 URL: <code className="bg-gray-100 px-2 py-1 rounded">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
