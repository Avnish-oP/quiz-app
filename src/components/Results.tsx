const Results = ({ score, totalQuestions }:any) => {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
          <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-lg mb-4">Your score: {score} / {totalQuestions}</p>
          <button
            onClick={() => location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  };
  
  export default Results;
  