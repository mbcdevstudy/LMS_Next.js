"use client"
import { PricingTable } from "@clerk/nextjs";


export function Pricing() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-center mb-4">
                    Transparent <span className="text-[#0d33f2]">Pricing</span>
                </h2>
                <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                    Choose the perfect plan for your learning journey
                </p>

                {/* Custom styled wrapper for Clerk PricingTable matching Stitch design */}
                <div className="clerk-pricing-wrapper max-w-6xl mx-auto">
                    <PricingTable />
                </div>
            </div>

            {/* Custom CSS to match Stitch design theme */}
            <style jsx global>{`
                /* Stitch Design Theme Integration */
                .clerk-pricing-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                /* Pricing cards styling */
                .clerk-pricing-wrapper .cl-pricingCard,
                .clerk-pricing-wrapper [data-localization-key*="pricingCard"] {
                    background: #0f0f10 !important; /* Darker Stitch-like black */
                    border: none !important; /* Removed border */
                    border-radius: 12px !important; /* Slightly more rounded */
                    transition: all 0.3s ease !important;
                }

                .clerk-pricing-wrapper .cl-pricingCard:hover,
                .clerk-pricing-wrapper [data-localization-key*="pricingCard"]:hover {
                    background: #151518 !important; /* Slightly lighter on hover */
                    transform: translateY(-4px) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important; 
                }

                /* Ensure inner containers don't add borders */
                .clerk-pricing-wrapper .cl-card,
                .clerk-pricing-wrapper .cl-rootBox {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                }

                /* Popular/Featured badge */
                .clerk-pricing-wrapper .cl-badge,
                .clerk-pricing-wrapper [class*="badge"] {
                    background: #0d33f2 !important;
                    color: white !important;
                    border-radius: 8px !important;
                    padding: 4px 12px !important;
                    font-weight: 600 !important;
                }

                /* Pricing buttons */
                .clerk-pricing-wrapper .cl-button,
                .clerk-pricing-wrapper button[type="button"] {
                    background: #0d33f2 !important;
                    color: white !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    transition: all 0.3s ease !important;
                    border: none !important;
                }

                .clerk-pricing-wrapper .cl-button:hover,
                .clerk-pricing-wrapper button[type="button"]:hover {
                    background: rgba(13, 51, 242, 0.9) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 10px 30px rgba(13, 51, 242, 0.3) !important;
                }

                /* Price text styling */
                .clerk-pricing-wrapper .cl-price,
                .clerk-pricing-wrapper [class*="price"] {
                    color: #0d33f2 !important;
                    font-weight: 700 !important;
                    font-size: 2.5rem !important;
                }

                /* Feature list styling */
                .clerk-pricing-wrapper .cl-featureList,
                .clerk-pricing-wrapper ul {
                    list-style: none !important;
                    padding: 0 !important;
                }

                .clerk-pricing-wrapper .cl-featureList li,
                .clerk-pricing-wrapper ul li {
                    padding: 8px 0 !important;
                    color: rgba(255, 255, 255, 0.8) !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }

                .clerk-pricing-wrapper .cl-featureList li:before,
                .clerk-pricing-wrapper ul li:before {
                    content: "✓" !important;
                    color: #0d33f2 !important;
                    font-weight: bold !important;
                    margin-right: 8px !important;
                }

                /* Plan name/title */
                .clerk-pricing-wrapper .cl-planName,
                .clerk-pricing-wrapper h3,
                .clerk-pricing-wrapper [class*="planName"] {
                    color: white !important;
                    font-weight: 700 !important;
                    font-size: 1.5rem !important;
                    margin-bottom: 8px !important;
                }

                /* Plan description */
                .clerk-pricing-wrapper .cl-planDescription,
                .clerk-pricing-wrapper p,
                .clerk-pricing-wrapper [class*="description"] {
                    color: rgba(255, 255, 255, 0.6) !important;
                    font-size: 0.875rem !important;
                }

                /* Grid layout for cards */
                .clerk-pricing-wrapper > div {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                    gap: 2rem !important;
                }

                /* Featured/Popular card highlight */
                .clerk-pricing-wrapper .cl-pricingCard[data-featured="true"],
                .clerk-pricing-wrapper [data-popular="true"] {
                    background: rgba(13, 51, 242, 0.1) !important;
                    border: 2px solid #0d33f2 !important;
                    position: relative !important;
                }

                /* Dark mode text colors */
                .clerk-pricing-wrapper * {
                    color: rgba(255, 255, 255, 0.9);
                }
            `}</style>
        </section>
    );
}
