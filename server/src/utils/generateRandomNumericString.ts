type GenerateRandomNumbersProps = {
  quantityDigits: number
}

export const generateRandomNumericString = ({
  quantityDigits,
}: GenerateRandomNumbersProps): string => {
  const rangeOfRandomNumbers = 10 ** quantityDigits

  const number = Math.floor(Math.random() * rangeOfRandomNumbers)
  return number.toString().padStart(quantityDigits, '0')
}
