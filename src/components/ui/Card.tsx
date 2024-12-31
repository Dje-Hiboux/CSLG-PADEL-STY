interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-dark-100 rounded-lg shadow-lg border border-dark-300 ${className}`}>
      {children}
    </div>
  );
}