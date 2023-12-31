"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";

function Bottombar() {
  const pathname = usePathname();

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link`}
              style={{background: isActive ? "linear-gradient(108deg, rgba(135,126,255,1) 10%, rgba(210,173,96,1) 90%)" : ""}}

            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className='object-contain'
              />
              {/* <p className="<p className='text-subtle-medium text-light-1 max-sm:hidden'>">{link.labl}</p> */}
              <p className='text-subtle-medium text-light-1 text-ellipsis max-md:text-[8px]'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
