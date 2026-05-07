"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Scale,
  Globe,
  ChevronDown,
  ChevronUp,
  Heart,
  Shield,
  TrendingUp,
  MapPin,
  DollarSign,
  Landmark,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const facts = [
  {
    icon: Scale,
    text: "The Dowry Prohibition Act was passed in India in 1961, making the giving or taking of dowry a criminal offense with imprisonment up to 2 years and fine up to ₹5,000. Despite being law for over 60 years, enforcement remains a challenge.",
  },
  {
    icon: AlertTriangle,
    text: "India reported approximately 187,879 dowry deaths in the past decade alone, according to the National Crime Records Bureau (NCRB). Dowry-related violence affects an estimated 7,000+ women annually, though the real number is believed to be much higher due to underreporting.",
  },
  {
    icon: Heart,
    text: "Modern marriages are increasingly based on mutual respect and equality. A 2023 survey showed 78% of urban Indian youth reject dowry practices, and several Indian states have seen significant shifts in attitudes, particularly among younger generations.",
  },
  {
    icon: Globe,
    text: "Bride price and dowry practices exist in over 90 countries worldwide, including South Africa (Lobola), China (Caili), Islamic countries (Mahr), and across South Asia. Each culture has unique traditions around marriage payments.",
  },
  {
    icon: Shield,
    text: "Section 498A of the Indian Penal Code provides protection to women against cruelty by husband or relatives, including dowry demands. Additionally, Section 304B addresses dowry deaths. In Pakistan, similar protections exist under the Dowry Restriction Act of 1976.",
  },
  {
    icon: TrendingUp,
    text: "The global trend is shifting against bride price and dowry. China has implemented government crackdowns on excessive caili (彩礼), South African courts have debated lobola regulations, and multiple international organizations are campaigning against the practice.",
  },
  {
    icon: DollarSign,
    text: "Bride prices range dramatically: from as low as $100 in some African communities to over $1.9 million in extreme cases reported in China. In India, dowry demands can range from ₹50,000 to several crores depending on the groom's profession.",
  },
  {
    icon: Users,
    text: "According to the United Nations, an estimated 1 in 3 women in South Asia have experienced some form of dowry-related pressure. The practice affects an estimated 263 million people across India, Pakistan, and Bangladesh alone.",
  },
];

// Worldwide bride price/dowry practices data for SEO
const worldwidePractices = [
  {
    country: "India, Pakistan, Bangladesh",
    term: "Dahej / Dowry / Jahez / Daijo",
    direction: "Bride's family → Groom's family",
    amount: "₹50,000 - ₹5 Crore+",
    legality: "Illegal in India (1961), restricted in Pakistan (1976), active in Bangladesh",
    description: "The most widely known form of marriage payment in South Asia, dowry involves cash, jewelry, vehicles, and property given by the bride's family to the groom. Despite legal prohibitions, the practice remains deeply embedded in social customs across India, Pakistan, Bangladesh, Nepal, and Sri Lanka. In India alone, the practice costs families an estimated billions of dollars annually.",
    keywords: "dowry calculator, dahej calculator, jahez calculator, bride price south asia",
  },
  {
    country: "South Africa, Zimbabwe, Zambia",
    term: "Lobola / Lobolo / Roora",
    direction: "Groom's family → Bride's family",
    amount: "$3,000 - $30,000+",
    legality: "Legal and culturally protected; debates around regulation",
    description: "Lobola is a centuries-old African tradition where the groom's family pays the bride's family in cash or cattle as a sign of respect and gratitude. In Zulu culture, the traditional unit is cattle (11 heads is common), though cash equivalents are now widely used. The practice is deeply respected in Southern Africa, with dedicated calculator websites like lobolacalculator.co.za and lobolo.co.za receiving significant traffic.",
    keywords: "lobola calculator, lobolo calculator, roora calculator, african bride price",
  },
  {
    country: "China, Taiwan, Singapore",
    term: "Caili (彩礼) / Bride Price",
    direction: "Groom's family → Bride's family",
    amount: "$1,000 - $1,900,000+",
    legality: "Government campaigns against excessive amounts; not illegal",
    description: "Caili (彩礼) is the Chinese bride price tradition that has escalated dramatically due to gender imbalance from the one-child policy. Prices vary enormously by province: rural Henan may ask ¥100,000, while wealthy Shanghai families may demand millions. In one extreme case, a man delivered $1.9 million in cash and gold bars to his fiancee's family by armored truck. The Chinese government has launched campaigns to curb excessive caili, calling it a social evil. No dedicated caili calculator currently exists — a major market gap.",
    keywords: "caili calculator, 彩礼计算器, bride price china, chinese wedding cost",
  },
  {
    country: "Islamic Countries (Global)",
    term: "Mahr / Mehr / Meher",
    direction: "Groom → Bride (directly)",
    amount: "Variable; minimum 10 Dirhams (~$50) to millions",
    legality: "Religious obligation under Sharia law; mandatory in Islam",
    description: "Mahr is an Islamic mandatory payment from the groom to the bride, given as a financial security and protection. Unlike dowry, Mahr belongs exclusively to the bride. Two main types exist: Mahr Fatimi (associated with Fatima, daughter of Prophet Muhammad — approximately 400 silver Dirhams) and Mahr Mu'ajjal (prompt) or Mahr Mu'akkhar (deferred). A few Mahr calculators exist (theblessednights.com, nikahmasterclass.com) that convert amounts between currencies and gold values.",
    keywords: "mahr calculator, mehr calculator, islamic mahr, mahr fatimi calculator, deferred mahr",
  },
  {
    country: "Kenya, Uganda, Tanzania",
    term: "Bride Price / Dowry",
    direction: "Groom's family → Bride's family",
    amount: "$500 - $50,000+",
    legality: "Legal; some regulation attempts",
    description: "In East Africa, bride price is practiced across multiple ethnic communities. Among the Kikuyu of Kenya, the tradition involves goats and sheep alongside cash. In some Ugandan communities, bride price can include cows, goats, hoes, and cash. A Kenyan bishop made headlines by revealing she paid Sh17 million ($130,000+) in dowry for her husband. The practice remains a significant cultural expectation across East Africa.",
    keywords: "bride price calculator africa, kenya bride price, ugandan bride price",
  },
  {
    country: "South Sudan, Ethiopia, Somalia",
    term: "Bride Price (Cattle-based)",
    direction: "Groom's family → Bride's family",
    amount: "20-200+ cattle",
    legality: "Culturally mandated; no legal restriction",
    description: "In South Sudan and parts of Ethiopia and Somalia, bride price is calculated in cattle rather than cash. A typical South Sudanese bride price ranges from 20 to 200 cattle, with each cow worth approximately $500-$1,000. This creates enormous economic pressure in one of the world's poorest regions. Cattle-based bride prices are among the oldest forms of marriage payment, predating written currency.",
    keywords: "bride price cattle calculator, south sudan bride price, african marriage customs",
  },
  {
    country: "Iran, Afghanistan, Tajikistan",
    term: "Jahiziyeh / Mahr",
    direction: "Both directions (varies)",
    amount: "Variable",
    legality: "Mandatory in Islam; Jahiziyeh debated",
    description: "In Persian and Afghan cultures, Jahiziyeh (جهیزیه) refers to goods and household items provided by the bride's family, while Mahr is the groom's obligation. Unlike Indian dowry, Jahiziyeh is framed as the bride's personal property and includes household essentials. In Afghanistan, the combination of high Mahr and Jahiziyeh expectations creates significant financial barriers to marriage.",
    keywords: "jahiziyeh calculator, afghan wedding cost, iranian marriage customs",
  },
  {
    country: "Philippines, Thailand, Myanmar",
    term: "Bigay-Kaya / Sin Sod / Bride Price",
    direction: "Groom → Bride's family",
    amount: "$500 - $50,000+",
    legality: "Legal; culturally significant",
    description: "In the Philippines, Bigay-Kaya is a traditional gift-giving practice during weddings. In Thailand, Sin Sod (สินสอด) is a bride price given in gold and cash, often displayed at the wedding ceremony. Thai Sin Sod amounts are typically calculated based on the bride's education and family status. In Myanmar, bride price traditions vary by ethnic group, with the Bamar and Shan communities having distinct practices.",
    keywords: "sin sod calculator, thai bride price, philippine wedding cost, bigay kaya",
  },
];

const faqs = [
  {
    question: "Is this dahej calculator real?",
    answer:
      "No, this calculator is purely satirical and created for educational purposes. It is designed to highlight the absurdity and harmfulness of dowry practices. The calculations are fictional and should not be taken seriously. Dowry is illegal in India under the Dowry Prohibition Act of 1961, and we strongly support the elimination of all dowry practices.",
  },
  {
    question: "What is dahej (dowry) and why is it harmful?",
    answer:
      "Dahej (दहेज) is the Hindi term for dowry — the payment of cash, jewelry, vehicles, or property from the bride's family to the groom's family at the time of marriage. It is harmful because it treats marriage as a financial transaction, puts enormous financial pressure on families with daughters (often leading to debt or bankruptcy), devalues women by making them seem like commodities whose worth is measured in money, leads to domestic violence and dowry deaths when demands are not met, and perpetuates deep-rooted gender inequality in society. According to NCRB data, over 7,000 dowry-related deaths are reported in India annually.",
  },
  {
    question: "Is dowry illegal in India?",
    answer:
      "Yes, dowry is illegal in India under the Dowry Prohibition Act of 1961. The Act defines dowry as any property or valuable security given or agreed to be given in connection with marriage. Both giving and taking dowry are punishable offenses with imprisonment up to 2 years and a fine up to ₹5,000. Additional protections exist under Section 498A of the IPC against cruelty related to dowry demands, and Section 304B for dowry deaths. Despite this comprehensive legislation, the practice continues in various forms across the country.",
  },
  {
    question: "How is the dowry amount calculated in this calculator?",
    answer:
      "The calculation is entirely satirical and based on arbitrary factors like salary, profession, education, property ownership, and location. There is no real formula for calculating a human being's worth — that is precisely the point. The calculator uses these factors to generate a fictional amount that illustrates how absurd it is to put a monetary value on a person. The amounts shown are meant to provoke thought and discussion about the issue.",
  },
  {
    question: "What is the difference between dowry and bride price?",
    answer:
      "Dowry (dahej) flows from the bride's family to the groom's family, while bride price (lobola, caili, etc.) flows from the groom's family to the bride's family. Despite the different directions, both practices can be problematic when they create financial burdens or commodify marriage. In India, dowry has been linked to domestic violence and deaths. In Africa, excessive bride price can trap couples in debt. In China, skyrocketing caili has been called a barrier to marriage for young men in rural areas.",
  },
  {
    question: "What is Lobola in South Africa?",
    answer:
      "Lobola (also spelled lobolo) is a Southern African tradition where the groom's family pays the bride's family as a sign of respect and gratitude. Traditionally paid in cattle (11 heads for Zulu culture), it is now often given in cash equivalents ranging from $3,000 to $30,000 or more. Lobola is legal and culturally protected in South Africa, though there are ongoing debates about regulation. Several lobola calculator websites exist, including lobolacalculator.co.za and calculatelobola.co.za.",
  },
  {
    question: "What is Mahr in Islamic marriage?",
    answer:
      "Mahr (مهر) is a mandatory payment in Islamic marriages from the groom to the bride. Unlike dowry, Mahr belongs exclusively to the bride and serves as her financial security. The minimum Mahr is 10 Dirhams (approximately $50), while Mahr Fatimi (associated with Prophet Muhammad's daughter Fatima) is approximately 400 silver Dirhams. Mahr can be paid immediately (mu'ajjal) or deferred (mu'akkhar). Several online Mahr calculators exist to help determine appropriate amounts.",
  },
  {
    question: "What is Caili (彩礼) in China?",
    answer:
      "Caili (彩礼) is the Chinese bride price tradition where the groom's family gives money or goods to the bride's family. Caili has escalated dramatically due to gender imbalance from China's one-child policy, resulting in millions more men than women of marriageable age. Prices vary enormously by province — from ¥10,000 in some rural areas to over ¥10 million in wealthy cities like Shanghai. The Chinese government has actively campaigned against excessive caili, calling it a social evil. As of 2025, no dedicated caili calculator website exists.",
  },
  {
    question: "What are the dowry laws in Pakistan and Bangladesh?",
    answer:
      "In Pakistan, the Dowry and Bridal Gifts (Restriction) Act of 1976 restricts dowry to ₹5,000 and bridal gifts to the value of 10% of the groom's annual income. However, enforcement is weak. In Bangladesh, the Dowry Prohibition Act of 1980 makes dowry giving and taking punishable offenses with imprisonment up to 5 years. Despite these laws, the practice remains widespread in both countries, with families often facing social pressure to provide lavish dowries regardless of legal restrictions.",
  },
  {
    question: "What can I do to stop dowry and bride price practices?",
    answer:
      "You can help by: (1) Refusing to participate in dowry/bride price exchanges in your own marriage, (2) Speaking up against these practices in your family and community, (3) Educating others about the legal and social consequences, (4) Supporting organizations working to end these practices like NCW, UN Women, and local NGOs, (5) Reporting dowry-related harassment to authorities (dial 181 in India), (6) Promoting gender equality in all aspects of life, (7) Using social media to spread awareness, and (8) Supporting legislation that protects women's rights in marriage.",
  },
  {
    question: "What are the wedding cost trends in India for 2025?",
    answer:
      "Indian wedding costs have risen dramatically, with the average wedding now costing between ₹20 lakhs to ₹5 crores. Major cost components include venue (₹3-15 lakhs), catering (₹2-8 lakhs), jewelry (₹5-50 lakhs), clothing (₹1-5 lakhs), photography (₹1-3 lakhs), and decorations (₹2-5 lakhs). Destination weddings in venues like Udaipur or Goa can exceed ₹1 crore. The wedding industry in India is estimated at ₹10 lakh crores annually. These escalating costs put additional pressure on families already burdened by dowry expectations.",
  },
  {
    question: "Who created this Dahej Calculator website?",
    answer:
      "This website was created as a social awareness tool by a team passionate about gender equality and social justice. Our mission is to educate people about the harmful effects of dowry, bride price, and other marriage payment practices across the world. We believe that marriages should be built on love, respect, and partnership — not financial transactions. The calculator uses humor and satire to make a serious point about a deeply rooted social issue.",
  },
];

export default function SeoContent() {
  const [expandedFact, setExpandedFact] = useState<number | null>(null);

  return (
    <div className="space-y-16">
      {/* Understanding Dowry */}
      <section id="about">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium mb-3">
            EDUCATIONAL CONTENT
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Understanding Dowry Practices
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            A comprehensive look at the history, legal status, and modern
            perspectives on dowry in South Asian societies and beyond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-orange-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-3">Historical Context</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dowry has been practiced across many cultures throughout history.
                Originally, it often served as a way to provide financial security
                for a bride in her new household through the form of Streedhan
                (women&apos;s wealth). However, over centuries, particularly in
                South Asia, it evolved into a problematic practice that
                commodified women and created devastating financial burdens for
                families with daughters. What began as a protective measure was
                twisted into an exploitative system that treats women as
                transactional commodities rather than equal partners in marriage.
                Historical records show similar practices in ancient Greece,
                Rome, and medieval Europe before declining in the West.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-3">Legal Status in India</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In India, the Dowry Prohibition Act of 1961 made giving and
                taking dowry illegal. The law defines dowry as property or
                valuable security given either directly or indirectly by one
                party to a marriage to the other party. Additional protections
                exist under Section 498A of the IPC against cruelty by husband
                or relatives, and Section 304B for dowry deaths, which carries
                a minimum sentence of 7 years imprisonment. Despite this
                comprehensive legislation, enforcement remains challenging and
                the practice continues in various forms across the country,
                particularly in rural areas where awareness of legal rights is
                limited. The NCRB reports over 7,000 dowry deaths annually.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-3">Modern Perspectives</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Today, a growing movement of young couples, families, and
                organizations are rejecting dowry practices in favor of
                marriages based on mutual respect, love, and equality.
                Educational campaigns, social media awareness, and legal
                literacy programs continue to raise awareness about the harmful
                effects of dowry on society. Many communities now celebrate
                dowry-free marriages, and several Indian states have seen
                significant shifts in attitudes, particularly among younger
                generations who view marriage as a partnership rather than a
                financial transaction. A 2023 survey showed 78% of urban Indian
                youth reject dowry practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Did You Know */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Did You Know?
          </h2>
          <p className="text-muted-foreground mt-2">
            Important facts about dowry and bride price practices worldwide
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            const isExpanded = expandedFact === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() =>
                    setExpandedFact(isExpanded ? null : idx)
                  }
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={isExpanded ? "expanded" : "collapsed"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-sm leading-relaxed ${
                            isExpanded
                              ? ""
                              : "line-clamp-2"
                          }`}
                        >
                          {fact.text}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <button className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Worldwide Bride Price Comparison - MAJOR SEO SECTION */}
      <section id="worldwide">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs font-medium mb-3">
            GLOBAL COMPARISON
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Bride Price & Dowry Practices <span className="golden-text">Worldwide</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Marriage payment traditions exist in over 90 countries. Explore how different cultures
            approach bride price (groom pays bride&apos;s family) and dowry (bride&apos;s family pays groom).
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {worldwidePractices.map((practice, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 md:p-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{practice.country}</h3>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-orange-600">{practice.term}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-13 md:ml-0">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                          {practice.direction}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs font-medium">
                          {practice.amount}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 md:p-6 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {practice.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 flex-1">
                        <Landmark className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legal Status</p>
                          <p className="text-xs text-foreground mt-0.5">{practice.legality}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section with Expanded Schema */}
      <section id="faq">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-medium mb-3">
            COMPREHENSIVE FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about dowry, dahej, bride price, lobola, mahr, and caili
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="bg-white rounded-xl border px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* JSON-LD Schema for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </section>

      {/* Resources */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Helpful Resources & Helplines</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: "NCW India - Dowry Prohibition Act", href: "https://ncw.nic.in" },
            { label: "UNICEF India - Ending Child Marriage", href: "https://www.unicef.org/india/" },
            { label: "UN Women - Ending Violence Against Women", href: "https://www.unwomen.org" },
            { label: "NCRB Crime Statistics India", href: "https://ncrb.gov.in" },
            { label: "Women Helpline India: 181", href: "tel:181" },
            { label: "Emergency: 112", href: "tel:112" },
            { label: "NCW Complaint: 7827170170", href: "tel:7827170170" },
            { label: "Dowry Prohibition Officers Directory", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* Bottom SEO Content Block - Wedding Cost Keywords */}
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Wedding Cost Calculator Guide
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Planning a wedding in India? Understanding the full cost breakdown is crucial. The average Indian wedding
          costs between ₹20 lakhs to ₹5 crores, with major expenses including venue booking (₹3-15 lakhs),
          catering for 200-1000 guests (₹2-8 lakhs), bridal jewelry (₹5-50 lakhs), wedding attire (₹1-5 lakhs
          per person), photography and videography (₹1-3 lakhs), mehendi and sangeet events (₹1-3 lakhs),
          and decorations and florals (₹2-5 lakhs). Destination weddings in popular locations like Udaipur,
          Jaipur, Goa, or Kerala can exceed ₹1 crore. The total Indian wedding industry is estimated at
          ₹10 lakh crores annually. While wedding expenses are a personal choice, the additional burden of
          dowry demands makes weddings financially devastating for many families. Use our free dahej calculator
          above to see the satirical side of this serious issue, and remember that a beautiful marriage
          doesn&apos;t require a beautiful bank balance — it requires love, respect, and partnership.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For wedding cost planning in specific cities: A Delhi wedding averages ₹30-50 lakhs, Mumbai ₹40-80 lakhs,
          Bangalore ₹25-40 lakhs, Chennai ₹20-35 lakhs, Hyderabad ₹25-45 lakhs, Kolkata ₹15-30 lakhs, and
          Jaipur destination weddings ₹50 lakhs to ₹2 crores. These costs exclude any dowry demands, which
          can add another ₹5-50 lakhs or more to the bride&apos;s family expenses. Our satirical dowry calculator
          aims to spark conversation about why these financial expectations in marriage need to end.
        </p>
      </section>
    </div>
  );
}
