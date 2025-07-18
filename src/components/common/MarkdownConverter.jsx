import React from "react";
import MarkdownIt from "markdown-it";

const MarkdownConverter = ({ setNewValue, newValue, newKey, title }) => {
  const markdownIt = new MarkdownIt();
  const content = markdownIt.render(newValue);

  return (
    <div className="grid grid-cols-2 gap-7 mt-4">
      <div>
        <label htmlFor="new-value" className="inputLabel">
          {title || "Tag Value"}
        </label>
        <textarea
          id="new-value"
          placeholder={`Enter ${newKey} tag value here`}
          className="inputField mt-1 h-96"
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="new-value" className="inputLabel">
          Markdown Converted Text
        </label>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="inputField min-h-fit mt-1 overflow-y-scroll h-96 markdown-content"
        />
      </div>
    </div>
  );
};

export default MarkdownConverter;
