import Link from "next/link";


export function Footer() {

    return (
        <section>
            {/* ─── FOOTER ─── */}
            <footer className="border-t border-border py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl font-bold text-foreground">Sprint.Io</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                The world&apos;s most engaging gamified learning platform.
                            </p>
                        </div>
                        {[
                            {
                                title: "Product",
                                links: [
                                    { name: "Features", href: "/#features" },
                                    { name: "Paths", href: "/paths" },
                                    { name: "Leaderboard", href: "/#leaderboard" },
                                    { name: "Reviews", href: "/#testimonials" }
                                ]
                            },
                            { title: "Company", links: [{ name: "About", href: "/#how-it-works" }, { name: "Blog", href: "#" }, { name: "Press", href: "#" }] },
                            { title: "Connect", links: [{ name: "Twitter", href: "#" }, { name: "Discord", href: "#" }, { name: "GitHub", href: "#" }, { name: "Contact", href: "#" }] },
                        ].map((col) => (
                            <div key={col.title}>
                                <p className="font-bold text-foreground text-sm mb-4">{col.title}</p>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={typeof link === 'string' ? link : link.name}>
                                            <Link
                                                href={typeof link === 'string' ? "#" : link.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                                            >
                                                {typeof link === 'string' ? link : link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground font-medium">© 2026 Sprint.Io. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-muted-foreground font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
}
