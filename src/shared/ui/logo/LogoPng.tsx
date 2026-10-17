function LogoPng({
  size = 'medium',
  color = 'primary',
}: {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
}) {
  const sizeMap: any = {
    small: 40,
    medium: 60,
    large: 80,
  };
  return (
    <img
      src={`/logo/g24.${color}-nobg.png`}
      alt="gymsaas24 logo"
      style={{
        height: sizeMap[size],
        objectFit: 'contain',
        borderRadius: 10,
      }}
    />
  );
}
