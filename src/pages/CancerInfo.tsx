import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Shield, Pill, FileText } from "lucide-react";

const cancerData: Record<string, any> = {
  "brain-cancer": {
    name: "Brain Cancer",
    description: "Brain cancer involves abnormal cell growth in brain tissue. It can be primary (starting in the brain) or metastatic (spreading from elsewhere).",
    causes: ["Genetic mutations", "Radiation exposure", "Family history", "Immune system disorders"],
    symptoms: ["Persistent headaches", "Seizures", "Vision or hearing problems", "Memory issues", "Balance difficulties"],
    prevention: ["Avoid radiation exposure when possible", "Maintain healthy lifestyle", "Regular check-ups"],
    treatment: "Treatment may include surgery, radiation therapy, chemotherapy, and targeted drug therapy depending on tumor type and location.",
  },
  "oral-cancer": {
    name: "Oral Cancer",
    description: "Oral cancer affects the mouth, tongue, lips, and throat. Early detection significantly improves treatment success.",
    causes: ["Tobacco use", "Heavy alcohol consumption", "HPV infection", "Sun exposure (lip cancer)"],
    symptoms: ["Mouth sores that don't heal", "White or red patches", "Difficulty swallowing", "Persistent mouth pain", "Lumps in neck"],
    prevention: ["Avoid tobacco", "Limit alcohol", "HPV vaccination", "Use lip protection in sun", "Regular dental check-ups"],
    treatment: "Typically involves surgery, radiation therapy, and may include chemotherapy or targeted therapy.",
  },
  "thyroid-cancer": {
    name: "Thyroid Cancer",
    description: "Thyroid cancer begins in the thyroid gland in the neck. Most types grow slowly and are highly treatable.",
    causes: ["Radiation exposure", "Genetic syndromes", "Family history", "Gender (more common in women)"],
    symptoms: ["Lump in neck", "Voice changes", "Difficulty swallowing", "Neck pain", "Swollen lymph nodes"],
    prevention: ["Avoid unnecessary radiation", "Regular screening if at high risk", "Healthy diet with adequate iodine"],
    treatment: "Usually involves surgery to remove thyroid, followed by radioactive iodine treatment and hormone therapy.",
  },
  "breast-cancer": {
    name: "Breast Cancer",
    description: "Breast cancer is one of the most common cancers. Early detection through screening significantly improves outcomes.",
    causes: ["Age", "Family history", "Genetic mutations (BRCA1, BRCA2)", "Hormone factors", "Lifestyle factors"],
    symptoms: ["Breast lump", "Breast shape changes", "Skin dimpling", "Nipple discharge", "Swelling"],
    prevention: ["Regular mammograms", "Self-examinations", "Healthy weight", "Limit alcohol", "Exercise regularly", "Breastfeeding"],
    treatment: "May include surgery (lumpectomy or mastectomy), radiation, chemotherapy, hormone therapy, or targeted therapy.",
  },
  "lung-cancer": {
    name: "Lung Cancer",
    description: "Lung cancer is a leading cause of cancer death. Smoking is the primary risk factor, but non-smokers can also develop it.",
    causes: ["Smoking", "Secondhand smoke", "Radon exposure", "Asbestos", "Air pollution", "Family history"],
    symptoms: ["Persistent cough", "Chest pain", "Shortness of breath", "Coughing up blood", "Weight loss", "Hoarseness"],
    prevention: ["Don't smoke", "Avoid secondhand smoke", "Test for radon", "Avoid carcinogens", "Exercise regularly"],
    treatment: "Options include surgery, radiation, chemotherapy, targeted therapy, and immunotherapy depending on stage.",
  },
  "colon-cancer": {
    name: "Colon Cancer",
    description: "Colon cancer typically begins as polyps in the large intestine. Regular screening can detect and remove polyps before they become cancerous.",
    causes: ["Age", "Diet high in red meat", "Low fiber diet", "Inflammatory bowel disease", "Family history", "Obesity"],
    symptoms: ["Change in bowel habits", "Blood in stool", "Abdominal pain", "Unexplained weight loss", "Fatigue"],
    prevention: ["Regular colonoscopy screening", "High-fiber diet", "Exercise", "Limit red meat", "Maintain healthy weight"],
    treatment: "Usually involves surgery to remove cancer, often followed by chemotherapy or radiation therapy.",
  },
  "prostate-cancer": {
    name: "Prostate Cancer",
    description: "Prostate cancer is common in men, especially over 50. It often grows slowly and may not cause serious harm.",
    causes: ["Age", "Family history", "Race", "Obesity", "Genetic factors"],
    symptoms: ["Difficulty urinating", "Weak urine stream", "Blood in urine", "Pelvic discomfort", "Bone pain (advanced)"],
    prevention: ["Healthy diet", "Regular exercise", "Maintain healthy weight", "Discuss screening with doctor"],
    treatment: "May include active surveillance, surgery, radiation therapy, hormone therapy, or chemotherapy depending on stage.",
  },
};

const CancerInfo = () => {
  const { cancerType } = useParams<{ cancerType: string }>();
  const cancer = cancerType ? cancerData[cancerType] : null;

  if (!cancer) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Cancer Information Not Found</h1>
          <Link to="/body-map">
            <Button>Return to Body Map</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <Link to="/body-map">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2" size={20} />
              Back to Body Map
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-primary mb-4">{cancer.name}</h1>
              <p className="text-xl text-muted-foreground">{cancer.description}</p>
            </div>

            {/* Overview Card */}
            <Card className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <AlertCircle className="text-secondary mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Causes & Risk Factors</h2>
                  <ul className="space-y-2">
                    {cancer.causes.map((cause: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Symptoms */}
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="text-destructive mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Early Warning Signs</h2>
                  <p className="text-muted-foreground mb-4">
                    Recognizing these symptoms early can save lives. Consult a doctor if you experience:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {cancer.symptoms.map((symptom: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-destructive mr-2">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Prevention */}
            <Card className="p-8 bg-secondary/5">
              <div className="flex items-start space-x-4">
                <Shield className="text-secondary mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Prevention Strategies</h2>
                  <ul className="space-y-2">
                    {cancer.prevention.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-secondary mr-2">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Treatment */}
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <Pill className="text-primary mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Treatment Overview</h2>
                  <p className="text-muted-foreground">{cancer.treatment}</p>
                </div>
              </div>
            </Card>

            {/* Research Links */}
            <Card className="p-8 bg-primary/5">
              <div className="flex items-start space-x-4">
                <FileText className="text-primary mt-1" size={32} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">Medical Research</h2>
                  <p className="text-muted-foreground mb-4">
                    Access verified medical research and clinical studies about {cancer.name.toLowerCase()}.
                  </p>
                  <Link to="/research">
                    <Button>View Research Papers</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <div className="bg-accent/10 border-l-4 border-accent p-6 rounded">
              <p className="font-semibold text-accent">Important Medical Disclaimer</p>
              <p className="text-sm text-muted-foreground mt-2">
                This information is for educational purposes only and should not replace professional medical advice. 
                Always consult with qualified healthcare providers for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CancerInfo;
