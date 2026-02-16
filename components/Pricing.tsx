import { Check } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
    {
        name: "Basic",
        price: "Free",
        description: "Perfect for getting started",
        features: [
            "3 Free Courses",
            "Community Access",
            "Basic IDE"
        ],
        cta: "Join for Free",
        popular: false
    },
    {
        name: "Pro Developer",
        price: "$29",
        period: "/mo",
        description: "For serious learners",
        features: [
            "Unlimited Courses",
            "Verified Certificates",
            "AI Mentor Access",
            "Cloud Sandbox Pro"
        ],
        cta: "Start Pro Trial",
        popular: true
    },
    {
        name: "Team",
        price: "$99",
        period: "/mo",
        description: "For engineering squads",
        features: [
            "Everything in Pro",
            "Team Analytics",
            "Dedicated Success Manager",
            "SSO Integration"
        ],
        cta: "Contact Sales",
        popular: false
    }
];

export function Pricing() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">
                    Transparent <span className="text-primary">Pricing</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div key={index} className={`relative flex flex-col p-8 rounded-2xl border ${plan.popular ? 'border-primary bg-primary/5' : 'border-border bg-card/30'} backdrop-blur-sm`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground mb-6">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                            </div>

                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className={`w-full ${plan.popular ? '' : 'variant-outline'}`} variant={plan.popular ? 'default' : 'outline'}>
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
