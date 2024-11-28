import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from 'antd';

const style = {
  cursor: "move",
  width: "15%",
  margin: "0px 12px 15px 0px"
};

export const Card = memo(({ id, text, moveCard, findCard }) => {

  const originalIndex = findCard(id).index;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      }
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      }
    }),
    [findCard, moveCard]
  );

  const opacity = isDragging ? 0 : 1;

  return (<Button ref={(node) => drag(drop(node))} style={{ ...style, opacity }}> {text} </Button>);
});
