const toFixed = (num: number, fixed?: number) => {
    fixed = fixed || 2;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
}

const fantaMoneyToEuro = (money: number) => {
    return toFixed(money / 1000)
}

export { toFixed, fantaMoneyToEuro }