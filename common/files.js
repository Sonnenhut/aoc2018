export async function fileAsText(path) {
    const res = await fetch(path).then(resp => resp.text());
    return res;
}