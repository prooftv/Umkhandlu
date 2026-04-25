'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/NavigationMenu';
import { getLinkByLinkObject } from '@/lib/links';
import { cn } from '@/lib/utils';
import type { SettingsQueryResult } from '@/sanity.types';

export default function NavBar({
  menuItems,
}: {
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-end flex-1">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item._key}>
                {item.childMenu ? (
                  <>
                    <NavigationMenuTrigger
                      className={cn(navigationMenuTriggerStyle())}
                    >
                      {item.text}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-1 w-[200px]">
                        {item.childMenu.map((child) => (
                          <NavigationMenuLink key={child._key} asChild>
                            <Link
                              href={
                                child.link
                                  ? getLinkByLinkObject(child.link) || '#'
                                  : '#'
                              }
                              className="block p-2 hover:bg-gray-100 rounded-md"
                              {...(child.link?.openInNewTab
                                ? {
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                  }
                                : {})}
                            >
                              {child.text}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={
                        item.link ? getLinkByLinkObject(item.link) || '#' : '#'
                      }
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'cursor-pointer'
                      )}
                      {...(item.link?.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.text}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden text-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Menu</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M4 6h16M4 12h16M4 18h16'
            }
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <nav className="px-4 py-2">
            {menuItems.map((item) => (
              <div key={item._key}>
                {item.childMenu ? (
                  <>
                    <div className="py-2 px-4 font-medium">{item.text}</div>
                    <div className="pl-4">
                      {item.childMenu.map((child) => (
                        <Link
                          key={child._key}
                          href={
                            child.link
                              ? getLinkByLinkObject(child.link) || '#'
                              : '#'
                          }
                          className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                          {...(child.link?.openInNewTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={
                      item.link ? getLinkByLinkObject(item.link) || '#' : '#'
                    }
                    className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                    {...(item.link?.openInNewTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.text}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
