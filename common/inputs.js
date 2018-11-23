export async function loadInput(day, inputFileName) {
    const res = await fetch('day' + day.padStart(2, '0') + '/' + inputFileName).then(resp => resp.text());
    return res;
}

export async function loadInputA(day) {
    return loadInput(day, 'input_a.txt')
}
export async function loadInputB(day) {
    return loadInput(day, 'input_b.txt')
}