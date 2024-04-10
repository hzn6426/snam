import update from "immutability-helper";
import { memo, useCallback, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from "./Card.jsx";

export default (props) => {

    const style = {
        width: "100%",
        display: "flex",
        flexWrap: "wrap"
    };

    const Container = memo(() => {

        const [cards, setCards] = useState(props.items);

        useEffect(() => {
            props.onChange(cards);
        }, [cards])

        const findCard = useCallback(
            (id) => {
                const card = cards.filter((c) => `${c.id}` === id)[0];
                return {
                    card,
                    index: cards.indexOf(card)
                };
            },
            [cards]
        );

        const moveCard = useCallback(
            (id, atIndex) => {
                const { card, index } = findCard(id);
                setCards(
                    update(cards, {
                        $splice: [
                            [index, 1],
                            [atIndex, 0, card]
                        ]
                    })
                );
            },
            [findCard, cards, setCards]
        );

        return (<div style={style}>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={`${card.id}`}
                    text={card.text}
                    moveCard={moveCard}
                    findCard={findCard}
                />
            ))}
        </div>);
    });

    return (<DndProvider backend={HTML5Backend}><Container /></DndProvider>)
}