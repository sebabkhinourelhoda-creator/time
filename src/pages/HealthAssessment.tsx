import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calculator, Activity, AlertTriangle, CheckCircle, Heart, Info } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  info?: string;
  options: { text: string; points: number }[];
}

const questions: Question[] = [
  {
    id: 'age',
    text: 'Age',
    info: 'Cancer risk generally increases with age as cells accumulate damage over time.',
    options: [
      { text: 'Under 40 years', points: 0 },
      { text: 'Between 40 and 59 years', points: 1 },
      { text: '60 years or older', points: 2 }
    ]
  },
  {
    id: 'smoking',
    text: 'Smoking (cigarettes, shisha, or other tobacco products)',
    info: 'Tobacco contains over 70 known carcinogens that damage DNA and significantly increase cancer risk.',
    options: [
      { text: 'Never smoked', points: 0 },
      { text: 'Former smoker (quit more than a year ago)', points: 1 },
      { text: 'Currently smoke', points: 3 }
    ]
  },
  {
    id: 'bmi',
    text: 'Body Mass Index (BMI)',
    info: 'Excess body weight is linked to increased risk of several cancers through hormonal and inflammatory pathways.',
    options: [
      { text: 'Normal (less than 25)', points: 0 },
      { text: 'Overweight (between 25 and 29.9)', points: 1 },
      { text: 'Obese (30 or higher)', points: 2 }
    ]
  },
  {
    id: 'activity',
    text: 'Weekly physical activity (such as brisk walking, running, swimming)',
    info: 'Regular exercise strengthens immune system, helps maintain healthy weight, and reduces inflammation.',
    options: [
      { text: '150 minutes or more (active)', points: 0 },
      { text: 'Less than 150 minutes', points: 1 },
      { text: 'Very little or none (sedentary)', points: 2 }
    ]
  },
  {
    id: 'diet',
    text: 'Fruits and vegetables consumption',
    info: 'Fruits and vegetables contain antioxidants and fiber that help protect cells from damage.',
    options: [
      { text: '5 servings or more daily', points: 0 },
      { text: '1-4 servings daily', points: 1 },
      { text: 'Rarely or less than one serving daily', points: 2 }
    ]
  },
  {
    id: 'processed_meat',
    text: 'Processed meat consumption (sausages, deli meats, salami, etc.)',
    info: 'Processed meats contain preservatives and chemicals that may increase colorectal cancer risk.',
    options: [
      { text: 'Rarely or never', points: 0 },
      { text: '1-2 times per week', points: 1 },
      { text: '3 times or more per week', points: 2 }
    ]
  },
  {
    id: 'alcohol',
    text: 'Alcohol consumption',
    info: 'Alcohol can damage DNA and affect hormone levels, linked to several types of cancer.',
    options: [
      { text: 'Do not consume alcohol', points: 0 },
      { text: 'Consume alcohol (even in small amounts)', points: 2 }
    ]
  },
  {
    id: 'family_history',
    text: 'Family history of cancer',
    info: 'Genetic factors can increase cancer risk, making awareness and early screening important.',
    options: [
      { text: 'No known family history', points: 0 },
      { text: 'One first-degree relative (parent, sibling) affected', points: 1 },
      { text: 'More than one relative, or relative affected at young age (under 50)', points: 2 }
    ]
  },
  {
    id: 'sun_exposure',
    text: 'Sun exposure',
    info: 'UV radiation damages skin cells and is the primary cause of skin cancer.',
    options: [
      { text: 'Always use sunscreen and avoid sunburn', points: 0 },
      { text: 'Sometimes get sunburned', points: 1 },
      { text: 'Frequent sunburns or use tanning beds', points: 2 }
    ]
  },
  {
    id: 'passive_smoking',
    text: 'Passive smoking',
    info: 'Secondhand smoke contains the same harmful chemicals as direct smoking.',
    options: [
      { text: 'Not regularly exposed to passive smoking', points: 0 },
      { text: 'Live or work with smokers (regular exposure)', points: 1 }
    ]
  },
  {
    id: 'chronic_infection',
    text: 'Known chronic infections (such as Hepatitis B or C, HPV)',
    info: 'Some infections can cause chronic inflammation and cellular changes that increase cancer risk.',
    options: [
      { text: 'No', points: 0 },
      { text: 'Yes', points: 1 }
    ]
  },
  {
    id: 'chemical_exposure',
    text: 'Chemical exposure (through work or living environment)',
    info: 'Certain chemicals are known carcinogens that can damage DNA and increase cancer risk.',
    options: [
      { text: 'No exposure to known carcinogens (asbestos, benzene, pesticides)', points: 0 },
      { text: 'I believe I am exposed to these substances', points: 1 }
    ]
  }
];

const HealthAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'bmi' | 'assessment' | 'results'>('bmi');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [totalScore, setTotalScore] = useState<number | null>(null);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInM = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = weightInKg / (heightInM * heightInM);
      setBmi(calculatedBMI);
      
      // Auto-select BMI category in assessment
      let bmiPoints = 0;
      if (calculatedBMI >= 30) bmiPoints = 2;
      else if (calculatedBMI >= 25) bmiPoints = 1;
      
      setAnswers(prev => ({ ...prev, bmi: bmiPoints }));
      setCurrentStep('assessment');
    }
  };

  const handleAnswerChange = (questionId: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
  };

  const calculateRisk = () => {
    const total = Object.values(answers).reduce((sum, points) => sum + points, 0);
    setTotalScore(total);
    setCurrentStep('results');
  };

  const getRiskLevel = (score: number) => {
    if (score <= 6) return { level: 'Low Risk', color: 'bg-green-500', description: 'low' };
    if (score <= 13) return { level: 'Moderate Risk', color: 'bg-yellow-500', description: 'moderate' };
    return { level: 'High Risk', color: 'bg-red-500', description: 'high' };
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'bg-blue-500' };
    if (bmi < 25) return { category: 'Normal', color: 'bg-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'bg-yellow-500' };
    return { category: 'Obese', color: 'bg-red-500' };
  };

  const resetAssessment = () => {
    setCurrentStep('bmi');
    setHeight('');
    setWeight('');
    setBmi(null);
    setAnswers({});
    setTotalScore(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Health Assessment & BMI Calculator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Assess your health status with our comprehensive BMI calculator and cancer risk assessment tool
            </p>
          </div>

          {/* Important Disclaimer */}
          <Alert className="mb-6 sm:mb-8 bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-800 text-sm sm:text-base">
              <strong>Important Notice:</strong> This assessment is an educational awareness tool only and does not replace professional medical consultation. 
              The result is an estimate based on common risk factors and is not a diagnosis. Always consult your doctor to evaluate your health condition.
            </AlertDescription>
          </Alert>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className={`flex items-center ${currentStep === 'bmi' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="font-medium text-sm sm:text-base">BMI Calculator</span>
              </div>
              <div className="w-4 h-px sm:w-8 sm:h-px bg-border hidden sm:block"></div>
              <div className={`flex items-center ${currentStep === 'assessment' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="font-medium text-sm sm:text-base">Risk Assessment</span>
              </div>
              <div className="w-4 h-px sm:w-8 sm:h-px bg-border hidden sm:block"></div>
              <div className={`flex items-center ${currentStep === 'results' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="font-medium text-sm sm:text-base">Results</span>
              </div>
            </div>
          </div>

          {/* BMI Calculator Step */}
          {currentStep === 'bmi' && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calculator className="w-5 h-5" />
                  BMI Calculator
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Calculate your Body Mass Index to determine your weight category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height" className="text-sm sm:text-base">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm sm:text-base">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {bmi && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">
                      BMI: {bmi.toFixed(1)}
                    </div>
                    <Badge className={`text-white ${getBMICategory(bmi).color}`}>
                      {getBMICategory(bmi).category}
                    </Badge>
                  </div>
                )}

                <Button 
                  onClick={calculateBMI} 
                  className="w-full"
                  disabled={!height || !weight}
                >
                  Calculate BMI & Continue to Assessment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Risk Assessment Step */}
          {currentStep === 'assessment' && (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Activity className="w-5 h-5" />
                    Cancer Risk Assessment
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Answer the following questions to assess your cancer risk factors
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-6 sm:space-y-8">
                    {questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <div>
                          <h3 className="font-medium text-base sm:text-lg">
                            {index + 1}. {question.text}
                          </h3>
                          {question.info && (
                            <Alert className="mt-2 bg-blue-50 border-blue-200">
                              <Info className="h-4 w-4 text-blue-500" />
                              <AlertDescription className="text-blue-800 text-xs sm:text-sm">
                                💡 {question.info}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <RadioGroup
                          value={answers[question.id]?.toString() || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                          className="space-y-2"
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                              <RadioGroupItem 
                                value={option.points.toString()} 
                                id={`${question.id}-${optionIndex}`}
                                className="mt-0.5"
                              />
                              <Label 
                                htmlFor={`${question.id}-${optionIndex}`}
                                className="text-xs sm:text-sm cursor-pointer leading-relaxed flex-1"
                              >
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                      <Button variant="outline" onClick={() => setCurrentStep('bmi')} className="w-full sm:w-auto order-2 sm:order-1">
                        Back to BMI
                      </Button>
                      <Button 
                        onClick={calculateRisk}
                        disabled={Object.keys(answers).length < questions.length}
                        className="w-full sm:w-auto order-1 sm:order-2"
                      >
                        Calculate Risk Assessment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && totalScore !== null && (
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {/* BMI Results */}
              {bmi && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Calculator className="w-5 h-5" />
                      BMI Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                        BMI: {bmi.toFixed(1)}
                      </div>
                      <Badge className={`text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 ${getBMICategory(bmi).color}`}>
                        {getBMICategory(bmi).category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment Results */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Heart className="w-5 h-5" />
                    Cancer Risk Assessment Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                      Total Score: {totalScore}/24
                    </div>
                    <Badge className={`text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 ${getRiskLevel(totalScore).color}`}>
                      {getRiskLevel(totalScore).level}
                    </Badge>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {getRiskLevel(totalScore).description === 'low' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800 text-sm sm:text-base">
                          <strong>Low Risk (Relative):</strong> Your results indicate that you have few common risk factors. 
                          This is excellent! Continue maintaining your healthy lifestyle (such as not smoking, eating healthy, and staying physically active). 
                          Remember that aging is a risk factor itself, so it's essential to stick to regular checkups recommended by your doctor.
                        </AlertDescription>
                      </Alert>
                    )}

                    {getRiskLevel(totalScore).description === 'moderate' && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-yellow-800 text-sm sm:text-base">
                          <strong>Moderate Risk (Relative):</strong> Your results indicate several risk factors. 
                          The good news is that many of these (called "modifiable factors") are under your control. 
                          Look at the questions where you scored points (such as diet, physical activity, weight). 
                          Making small positive changes in these areas can make a big difference in reducing your risk. 
                          We strongly recommend discussing these factors with your doctor.
                        </AlertDescription>
                      </Alert>
                    )}

                    {getRiskLevel(totalScore).description === 'high' && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-800 text-sm sm:text-base">
                          <strong>High Risk (Relative):</strong> Your results indicate a large number of risk factors, 
                          some of which may have significant impact (such as smoking). This is not a diagnosis, 
                          but it's a strong indicator that serious action should be taken.
                          <br /><br />
                          <strong>Most Important Step:</strong> Please schedule an appointment with your doctor as soon as possible. 
                          Show them these answers. Your doctor can help you create a plan to control these risks 
                          (such as smoking cessation programs, nutrition plans, or early screenings) based on your complete health condition.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-6 text-center">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                      <Button onClick={resetAssessment} variant="outline" className="w-full sm:w-auto">
                        Start New Assessment
                      </Button>
                      <Button onClick={() => window.print()} className="w-full sm:w-auto">
                        Print Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HealthAssessment;