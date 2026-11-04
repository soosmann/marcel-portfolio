import { useEffect, useRef } from 'react';

export default function FadeInSection({ children, delay }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (
      !element ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    element.classList.add('will-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.classList.remove('will-animate');
    };
  }, []);

  return (
    <div ref={elementRef} className="fade-in-section" style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
}
