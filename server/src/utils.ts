export function getImageUrl(name: string | undefined): string {
    return `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3333}/uploads/${name}`;
}