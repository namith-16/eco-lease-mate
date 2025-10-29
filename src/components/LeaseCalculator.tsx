import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Calculator as CalculatorIcon } from "lucide-react";
import { useLeaseCalculator } from "@/hooks/useLeaseCalculator";
import { generatePDF } from "@/utils/pdfGenerator";
import styles from "./LeaseCalculator.module.scss";

interface LeaseCalculatorProps {
  onClose?: () => void;
}

const LeaseCalculator = ({ onClose }: LeaseCalculatorProps) => {
  const { inputs, outputs, updateInput, validPromoCodes } = useLeaseCalculator();

  const handleDownloadPDF = () => {
    generatePDF(inputs, outputs);
  };

  return (
    <div className={styles.calculator}>
      <Card className={styles.calculatorCard}>
        <CardHeader>
          <CardTitle className={styles.title}>
            <CalculatorIcon className="w-6 h-6" />
            <span>Lease Calculator</span>
            <span className={styles.malayalam}>കണക്കുകൂട്ടൽ</span>
          </CardTitle>
          <CardDescription>
            Calculate your monthly lease payment and total cost
          </CardDescription>
        </CardHeader>
        
        <CardContent className={styles.content}>
          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <Label htmlFor="months">Lease Duration</Label>
              <Select
                value={inputs.months.toString()}
                onValueChange={(value) => updateInput('months', parseInt(value))}
              >
                <SelectTrigger id="months">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="18">18 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="monthlyPrice">Monthly Base Price (₹)</Label>
              <Input
                id="monthlyPrice"
                type="number"
                value={inputs.monthlyPrice}
                onChange={(e) => updateInput('monthlyPrice', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="promoCode">Promo Code (Optional)</Label>
              <Input
                id="promoCode"
                type="text"
                value={inputs.promoCode}
                onChange={(e) => updateInput('promoCode', e.target.value)}
                placeholder="e.g., FIRST10, ECO15, LULU5"
              />
              <p className={styles.hint}>
                Valid codes: {validPromoCodes.join(', ')}
              </p>
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="tradeInCredit">Trade-in Credit (₹)</Label>
              <Input
                id="tradeInCredit"
                type="number"
                value={inputs.tradeInCredit}
                onChange={(e) => updateInput('tradeInCredit', parseFloat(e.target.value) || 0)}
                min="0"
                placeholder="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="deposit">Security Deposit (₹)</Label>
              <Input
                id="deposit"
                type="number"
                value={inputs.deposit}
                onChange={(e) => updateInput('deposit', parseFloat(e.target.value) || 0)}
                min="0"
                placeholder="0"
              />
            </div>

            <div className={styles.checkboxGroup}>
              <Checkbox
                id="maintenance"
                checked={inputs.maintenanceAddOn}
                onCheckedChange={(checked) => updateInput('maintenanceAddOn', !!checked)}
              />
              <Label htmlFor="maintenance" className={styles.checkboxLabel}>
                Add Extended Maintenance (₹499/month)
              </Label>
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={inputs.taxRate * 100}
                onChange={(e) => updateInput('taxRate', (parseFloat(e.target.value) || 0) / 100)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.resultsSection}>
            <h3 className={styles.resultsTitle}>Your Quote</h3>
            
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Base Total</span>
                <span className={styles.resultValue}>
                  ₹{outputs.total.toLocaleString('en-IN')}
                </span>
              </div>

              {outputs.promoDiscount > 0 && (
                <div className={styles.resultItem + ' ' + styles.discount}>
                  <span className={styles.resultLabel}>Promo Discount</span>
                  <span className={styles.resultValue}>
                    -₹{outputs.promoDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Tax (GST)</span>
                <span className={styles.resultValue}>
                  ₹{outputs.totalTax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className={styles.resultItem + ' ' + styles.primary}>
                <span className={styles.resultLabel}>Net Total</span>
                <span className={styles.resultValue}>
                  ₹{outputs.netTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Upfront Due</span>
                <span className={styles.resultValue}>
                  ₹{outputs.upfrontDue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className={styles.resultItem + ' ' + styles.highlight}>
                <span className={styles.resultLabel}>Monthly Payment</span>
                <span className={styles.resultValue}>
                  ₹{outputs.monthlyDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button 
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
              size="lg"
            >
              <Download className="w-5 h-5" />
              Download Quote (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseCalculator;
