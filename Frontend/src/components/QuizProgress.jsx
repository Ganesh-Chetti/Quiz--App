const Quiz = ({ onQuizProgress }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
    const handleAnswer = (selectedAnswer) => {
      // Calculate progress
      const newProgress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
      onQuizProgress(newProgress);
  
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };
  };
  