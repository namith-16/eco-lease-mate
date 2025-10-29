import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Calculator, Shield, Wrench, Battery, BarChart3, Clock, CheckCircle2, Zap } from "lucide-react";
import LeaseCard from "@/components/LeaseCard";
import LeaseCalculator from "@/components/LeaseCalculator";
import { toast } from "sonner";
import styles from "./LeasePage.module.scss";

const LeasePage = () => {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "lease",
    metAtEvent: false,
  });

  const pricingPlans = [
    {
      name: "Hourly",
      malayalamName: "മണിക്കൂറിൽ",
      price: 99,
      period: "hour",
      deposit: 500,
      features: ["Perfect for short trips", "Pay only for usage"],
    },
    {
      name: "Daily",
      malayalamName: "ദിവസം",
      price: 599,
      period: "day",
      deposit: 1000,
      features: ["24-hour access", "Unlimited kilometers"],
    },
    {
      name: "Monthly",
      malayalamName: "മാസം",
      price: 7599,
      period: "month",
      deposit: 5000,
      features: ["Best value for money", "All maintenance included"],
      highlighted: true,
    },
  ];

  const faqs = [
    {
      question: "Can I buy the scooter after the lease ends?",
      answer: "Yes! At the end of your lease, you have the option to purchase the scooter at a predetermined residual value, return it, or upgrade to a newer model.",
    },
    {
      question: "What happens if I exceed the kilometer limit?",
      answer: "Our lease plans include generous kilometer allowances. If you exceed the limit, excess kilometers are charged at ₹2/km. You can also opt for unlimited kilometer packages.",
    },
    {
      question: "How does trade-in credit work?",
      answer: "We accept your old scooter or bike as trade-in. Our team will inspect it and offer you a fair credit value that will be deducted from your total lease cost.",
    },
    {
      question: "Can I extend the battery warranty?",
      answer: "Absolutely! The standard battery warranty is 3 years / 50,000 km. You can extend it to 5 years / 80,000 km for an additional ₹2,999.",
    },
    {
      question: "Is the security deposit refundable?",
      answer: "Yes, your security deposit is fully refundable at the end of the lease term, provided the scooter is returned in good condition with no outstanding payments.",
    },
    {
      question: "How do promo codes work?",
      answer: "Use promo codes like FIRST10 (10% off), ECO15 (15% off), or LULU5 (5% off) when booking. Apply them in the calculator to see your instant discount.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    toast.success("Thank you! We'll contact you within 24 hours.");
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      interest: "lease",
      metAtEvent: false,
    });
  };

  return (
    <div className={styles.leasePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Lease a scooter. <span className={styles.highlight}>Zero up-front.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            ഒരു സ്കൂട്ടർ വാടകയ്ക്ക് എടുക്കുക
          </p>
          <p className={styles.heroDescription}>
            Flexible terms, maintenance & insurance included. Start riding today with no upfront costs.
          </p>
          
          <div className={styles.heroCtas}>
            <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className={styles.primaryCta}>
                  <Calculator className="w-5 h-5" />
                  Calculate Your Lease
                </Button>
              </DialogTrigger>
              <DialogContent className={styles.dialogContent}>
                <LeaseCalculator onClose={() => setCalculatorOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button size="lg" variant="outline" className={styles.secondaryCta} asChild>
              <a href="tel:+911800XXXXXX">
                <Phone className="w-5 h-5" />
                Book a Demo / Call
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
          <p className={styles.sectionSubtitle}>പ്ലാൻ തിരഞ്ഞെടുക്കുക</p>
          
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <LeaseCard
                key={plan.name}
                {...plan}
                onSelect={() => setCalculatorOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className={styles.included}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What's Included</h2>
          <p className={styles.sectionSubtitle}>ഉൾപ്പെട്ടിരിക്കുന്നത്</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Wrench />
              </div>
              <h3>Maintenance & Insurance</h3>
              <p>All maintenance and insurance costs handled. No surprises.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Shield />
              </div>
              <h3>24/7 Roadside Assistance</h3>
              <p>Help is always available when you need it, anywhere you are.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Battery />
              </div>
              <h3>Battery Warranty</h3>
              <p>
                Standard 3yrs / 50,000 km. 
                <Button variant="link" className={styles.warrantyLink}>
                  Extend to 5yrs / 80,000 km →
                </Button>
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Zap />
              </div>
              <h3>Trade-in Credit</h3>
              <p>Get instant credit for your old vehicle towards your lease.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BarChart3 />
              </div>
              <h3>Fleet Dashboard</h3>
              <p>For businesses: Track your fleet usage, costs, and maintenance in real-time.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <CheckCircle2 />
              </div>
              <h3>Flexible Upgrades</h3>
              <p>Upgrade to a newer model anytime during your lease term.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>എങ്ങനെ പ്രവർത്തിക്കുന്നു</p>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Book Online</h3>
              <p>Choose your plan and book your scooter online or call us.</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Inspect Trade-in</h3>
              <p>Optional: Bring your old vehicle for instant trade-in credit.</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Sign & Ride</h3>
              <p>Paperwork handled — sign digitally and ride away the same day.</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Support & Upgrade</h3>
              <p>Enjoy 24/7 support. Return, upgrade, or buy anytime.</p>
            </div>
          </div>
          
          <p className={styles.stepsFootnote}>
            Paperwork handled — upgrade in one visit
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ</p>
          
          <Accordion type="single" collapsible className={styles.accordion}>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className={styles.faqQuestion}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={styles.faqAnswer}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className={styles.leadForm}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Get Started Today</h2>
            <p className={styles.formSubtitle}>ഇന്ന് ആരംഭിക്കുക</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  pattern="[6-9][0-9]{9}"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  maxLength={255}
                />
              </div>

              <div className={styles.formGroup}>
                <Label>I'm interested in:</Label>
                <RadioGroup
                  value={formData.interest}
                  onValueChange={(value) => setFormData({ ...formData, interest: value })}
                >
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="retail" id="retail" />
                    <Label htmlFor="retail">Retail Purchase</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="lease" id="lease" />
                    <Label htmlFor="lease">Lease/Subscription</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="fleet" id="fleet" />
                    <Label htmlFor="fleet">Fleet/Business</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="franchise" id="franchise" />
                    <Label htmlFor="franchise">Franchise Opportunity</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className={styles.checkboxGroup}>
                <Checkbox
                  id="metAtEvent"
                  checked={formData.metAtEvent}
                  onCheckedChange={(checked) => setFormData({ ...formData, metAtEvent: !!checked })}
                />
                <Label htmlFor="metAtEvent">
                  I met EcoScoot at Lulu Mall / Forum Mall / Expo
                </Label>
              </div>

              <Button type="submit" size="lg" className={styles.submitButton}>
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeasePage;
