type BigFigureProps = {
    side: 'bid' | 'ask',
    price: number,
    scale: number
};

const getFigureParts = (price: number = 0, scale: number = 2): [string, string] => {
    const str = price.toFixed(scale);
    return [str.slice(0, -2) || '0.', str.slice(-2) || '00'];
};

const PriceView = ({ price, scale, side }: BigFigureProps) => {
    const bgColour = {
        bid: 'bg-lime-100',
        ask: 'bg-red-200'
    };
    const [smallFigure, bigFigure] = getFigureParts(price, scale);
    return (
        <div className={`${bgColour[side]} flex flex-row justify-center rounded-md  w-48 py-3`}>
            <div className="text-2xl mt-auto mb-[1px]">{smallFigure}</div>
            <div className="text-6xl">{bigFigure}</div>
        </div>
    );
};

export default PriceView;
