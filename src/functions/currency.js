const formatter = new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'});


export function toCurrency(value) {
    return formatter.format(value);
}