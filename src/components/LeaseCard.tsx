import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import styles from "./LeaseCard.module.scss";

export interface LeaseCardProps {
  name: string;
  price: number;
  period: string;
  deposit?: number;
  features: string[];
  highlighted?: boolean;
  onSelect?: () => void;
  malayalamName?: string;
}

const LeaseCard = ({
  name,
  price,
  period,
  deposit,
  features,
  highlighted = false,
  onSelect,
  malayalamName,
}: LeaseCardProps) => {
  return (
    <Card className={`${styles.leaseCard} ${highlighted ? styles.highlighted : ''}`}>
      <CardContent className={styles.cardContent}>
        {highlighted && (
          <Badge className={styles.popularBadge}>
            Most Popular
          </Badge>
        )}
        
        <div className={styles.header}>
          <h3 className={styles.planName}>{name}</h3>
          {malayalamName && (
            <p className={styles.malayalamName}>{malayalamName}</p>
          )}
        </div>

        <div className={styles.pricing}>
          <div className={styles.priceAmount}>
            <span className={styles.currency}>₹</span>
            <span className={styles.price}>{price.toLocaleString('en-IN')}</span>
          </div>
          <span className={styles.period}>/{period}</span>
        </div>

        {deposit !== undefined && deposit > 0 && (
          <p className={styles.deposit}>
            Deposit: ₹{deposit.toLocaleString('en-IN')}
          </p>
        )}

        <ul className={styles.features}>
          {features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              <Check className={styles.checkIcon} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          className={styles.selectButton}
          variant={highlighted ? "default" : "outline"}
          size="lg"
          onClick={onSelect}
        >
          {highlighted ? "Choose Plan" : "Book Now"}
        </Button>

        <p className={styles.disclaimer}>
          T&Cs apply • Prices subject to change
        </p>
      </CardContent>
    </Card>
  );
};

export default LeaseCard;
