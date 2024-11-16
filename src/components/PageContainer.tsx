type Props = {
  children: React.ReactNode;
};

export function PageContainer({ children }: Props) {
  return (
    <div className="flex flex-col items-center mt-9">
      <div className="w-full md:w-1/2 px-5">{children}</div>
    </div>
  );
}
