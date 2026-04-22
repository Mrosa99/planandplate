"use client";

import {
  Book,
  BookMarked,
  CalendarDays,
  Heart,
  LogOut,
  Menu,
  Settings,
  Sunset,
  Trees,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useAuthSession } from "@/lib/supabase/useAuthSession";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  requiresAuth?: boolean;
}

interface Navbar1Props {
  logo?: {
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
    logout?: {
      title: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Plan and Plate",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Recipes",
      url: "#",
      items: [
        {
          title: "All Recipes",
          description: "Explore our complete recipe library.",
          icon: <Book className="size-5 shrink-0" />,
          url: "/recipes",
        },
        {
          title: "Trending",
          description: "Recipes that are getting the most attention right now.",
          icon: <Book className="size-5 shrink-0" />,
          url: "/recipes",
        },
        {
          title: "Most Saved",
          description: "The recipes users love and save the most.",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/recipes",
        },
        {
          title: "New Recipes",
          description: "The latest additions fresh from the recipe feed.",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/recipes",
        },
        {
          title: "Random Recipe",
          description: "Get a surprise recipe with one click.",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/recipes",
        },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      requiresAuth: true,
    },
    {
      title: "Search",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/auth/login" },
    signup: { title: "Sign up", url: "/auth/signup" },
    logout: { title: "Logout" },
  },
}: Navbar1Props) => {
  const { session } = useAuthSession();
  const router = useRouter();
  const isAuthenticated = !!session;

  const getInitials = (email: string) => email.slice(0, 2).toUpperCase();

  const visibleMenu = menu.filter(
    (item) => !item.requiresAuth || isAuthenticated,
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <section className="sticky top-0 z-50 py-3 bg-background">
      <div className="container mx-auto flex w-full items-center">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex w-full items-center">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </div>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {visibleMenu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full w-9 h-9 p-0 font-semibold"
                    >
                      {session ? getInitials(session.user.email ?? "?") : "?"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-muted-foreground text-xs truncate">
                      {session?.user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="size-4" /> Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/collections" className="flex items-center gap-2 cursor-pointer">
                        <BookMarked className="size-4" /> Collections
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/meals" className="flex items-center gap-2 cursor-pointer">
                        <UtensilsCrossed className="size-4" /> Meals
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/calendar" className="flex items-center gap-2 cursor-pointer">
                        <CalendarDays className="size-4" /> Calendar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="size-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </>
              )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden justify-between w-full ">
          <div className="flex items-center justify-between pl-5 pr-5">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {visibleMenu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {isAuthenticated && (
                      <>
                        <p className="text-xs text-muted-foreground truncate">
                          {session?.user.email}
                        </p>
                        <div className="flex flex-col gap-1">
                          {[
                            { href: "/favorites", icon: <Heart className="size-4" />, label: "Favorites" },
                            { href: "/collections", icon: <BookMarked className="size-4" />, label: "Collections" },
                            { href: "/meals", icon: <UtensilsCrossed className="size-4" />, label: "Meals" },
                            { href: "/calendar", icon: <CalendarDays className="size-4" />, label: "Calendar" },
                            { href: "/settings", icon: <Settings className="size-4" />, label: "Settings" },
                          ].map(({ href, icon, label }) => (
                            <Link
                              key={label}
                              href={href}
                              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                            >
                              {icon} {label}
                            </Link>
                          ))}
                        </div>
                        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                          <LogOut className="size-4" /> {auth.logout?.title ?? "Logout"}
                        </Button>
                      </>
                    )}
                    {!isAuthenticated && (
                      <>
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          <div className="flex flex-col w-72 p-1">
            {item.items.map((subItem) => (
              <SubMenuLink key={subItem.title} item={subItem} />
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          <div className="flex flex-col">
            {item.items.map((subItem) => (
              <SubMenuLink key={subItem.title} item={subItem} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar1 };
