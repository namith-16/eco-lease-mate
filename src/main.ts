import './styles/main.css';
import { LeaseCalculator } from './calculator';
import { generatePDF } from './utils/pdfGenerator';

// Initialize calculator
const calculator = new LeaseCalculator({
  months: 12,
  monthlyPrice: 7599,
  promoCode: '',
  tradeInCredit: 0,
  deposit: 0,
  maintenanceAddOn: false,
  taxRate: 0.18,
});

// DOM Elements
const getElement = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Element ${selector} not found`);
  return element;
};

// Update calculator display
function updateCalculatorDisplay() {
  const outputs = calculator.getOutputs();
  
  getElement('#calc-total').textContent = `₹${outputs.total.toLocaleString('en-IN')}`;
  getElement('#calc-net-total').textContent = `₹${outputs.netTotal.toLocaleString('en-IN')}`;
  getElement('#calc-upfront').textContent = `₹${outputs.upfrontDue.toLocaleString('en-IN')}`;
  getElement('#calc-monthly').textContent = `₹${outputs.monthlyDue.toLocaleString('en-IN')}`;
  getElement('#calc-monthly-tax').textContent = `₹${outputs.monthlyTax.toLocaleString('en-IN')}`;
  getElement('#calc-total-tax').textContent = `₹${outputs.totalTax.toLocaleString('en-IN')}`;
  getElement('#calc-promo-discount').textContent = `₹${outputs.promoDiscount.toLocaleString('en-IN')}`;
}

// Initialize calculator modal
function initCalculator() {
  const modal = getElement('#calculator-modal');
  const openBtn = getElement('#open-calculator');
  const closeBtn = getElement('#close-calculator');
  
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Input handlers
  getElement<HTMLSelectElement>('#months').addEventListener('change', (e) => {
    calculator.updateInput('months', parseInt((e.target as HTMLSelectElement).value));
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#monthly-price').addEventListener('input', (e) => {
    calculator.updateInput('monthlyPrice', parseFloat((e.target as HTMLInputElement).value) || 0);
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#promo-code').addEventListener('input', (e) => {
    calculator.updateInput('promoCode', (e.target as HTMLInputElement).value);
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#trade-in').addEventListener('input', (e) => {
    calculator.updateInput('tradeInCredit', parseFloat((e.target as HTMLInputElement).value) || 0);
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#deposit').addEventListener('input', (e) => {
    calculator.updateInput('deposit', parseFloat((e.target as HTMLInputElement).value) || 0);
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#maintenance').addEventListener('change', (e) => {
    calculator.updateInput('maintenanceAddOn', (e.target as HTMLInputElement).checked);
    updateCalculatorDisplay();
  });
  
  getElement<HTMLInputElement>('#tax-rate').addEventListener('input', (e) => {
    calculator.updateInput('taxRate', parseFloat((e.target as HTMLInputElement).value) / 100 || 0);
    updateCalculatorDisplay();
  });
  
  // Download PDF
  getElement('#download-pdf').addEventListener('click', () => {
    generatePDF(calculator.getInputs(), calculator.getOutputs());
  });
  
  // Reset button
  getElement('#reset-calculator').addEventListener('click', () => {
    calculator.reset();
    
    // Reset form inputs
    (getElement<HTMLSelectElement>('#months')).value = '12';
    (getElement<HTMLInputElement>('#monthly-price')).value = '7599';
    (getElement<HTMLInputElement>('#promo-code')).value = '';
    (getElement<HTMLInputElement>('#trade-in')).value = '0';
    (getElement<HTMLInputElement>('#deposit')).value = '0';
    (getElement<HTMLInputElement>('#maintenance')).checked = false;
    (getElement<HTMLInputElement>('#tax-rate')).value = '18';
    
    updateCalculatorDisplay();
  });
  
  // Initial display
  updateCalculatorDisplay();
}

// Initialize FAQ accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');
        
        // Close all
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        
        // Open clicked if it was closed
        if (!isOpen) {
          answer.classList.add('open');
        }
      });
    }
  });
}

// Initialize lead form
function initLeadForm() {
  const form = getElement<HTMLFormElement>('#lead-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Lead form submitted:', data);
    alert('Thank you for your interest! We will contact you soon.');
    form.reset();
  });
}

// Pricing data for different plans
const PRICING_DATA = {
  elite: {
    '3month': 8999,
    '6month': 8499,
    '12month': 7999,
  },
  business: {
    '3month': 11499,
    '6month': 10999,
    '12month': 10499,
  },
};

let currentPlan: 'elite' | 'business' = 'elite';

// Update pricing display based on selected plan
function updatePricingDisplay() {
  const prices = PRICING_DATA[currentPlan];
  
  const price3month = document.querySelector('#price-3month');
  const price6month = document.querySelector('#price-6month');
  const price12month = document.querySelector('#price-12month');
  
  if (price3month) price3month.textContent = `₹${prices['3month'].toLocaleString('en-IN')}`;
  if (price6month) price6month.textContent = `₹${prices['6month'].toLocaleString('en-IN')}`;
  if (price12month) price12month.textContent = `₹${prices['12month'].toLocaleString('en-IN')}`;
}

// Initialize plan toggle
function initPlanToggle() {
  const toggle = document.querySelector('#plan-toggle');
  const labels = document.querySelectorAll('.plan-label');
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      currentPlan = currentPlan === 'elite' ? 'business' : 'elite';
      toggle.classList.toggle('active', currentPlan === 'business');
      
      // Update active label
      labels.forEach(label => {
        const plan = label.getAttribute('data-plan');
        label.classList.toggle('active', plan === currentPlan);
      });
      
      updatePricingDisplay();
    });
    
    // Set initial active state
    labels.forEach(label => {
      const plan = label.getAttribute('data-plan');
      label.classList.toggle('active', plan === currentPlan);
    });
  }
}

// Initialize smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFAQ();
  initLeadForm();
  initSmoothScroll();
  initPlanToggle();
  updatePricingDisplay();
});
