import type { Status} from "../models/Story";
import type {Story} from "../models/Story";

interface Props {
  stories: Story[];
  onDelete: (id: string) => void;
  onStatusChange: (story: Story, status: Status) => void;
}

export const StoryList = ({ stories, onDelete, onStatusChange }: Props) => {

  const renderColumn = (status: Status, title: string) => (
    <div>
      <h3>{title}</h3>
      {stories
        .filter(s => s.status === status)
        .map(s => (
          <div key={s.id}>
            <h4>{s.name}</h4>
            <p>{s.description}</p>
            <p>Priority: {s.priority}</p>

            <button onClick={() => onStatusChange(s, "todo")}>Todo</button>
            <button onClick={() => onStatusChange(s, "doing")}>Doing</button>
            <button onClick={() => onStatusChange(s, "done")}>Done</button>

            <button onClick={() => onDelete(s.id)}>Delete</button>
          </div>
        ))}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {renderColumn("todo", "To Do")}
      {renderColumn("doing", "Doing")}
      {renderColumn("done", "Done")}
    </div>
  );
};