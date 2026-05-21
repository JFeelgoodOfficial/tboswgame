import { FLAGS } from '../dialogue/tbosw-dialogue-fixed.js';

export class DialogueEngine {
  constructor(tree, onTrigger, onFlagSet, onSceneComplete) {
    this.tree = tree;
    this.currentId = tree.startId;
    this.onTrigger = onTrigger || (() => {});
    this.onFlagSet = onFlagSet || (() => {});
    this.onSceneComplete = onSceneComplete || (() => {});
    this._fireTriggerForLine(this.getLine(this.currentId));
  }

  getLine(id) {
    return this.tree.lines[id] || null;
  }

  getCurrentLine() {
    return this.getLine(this.currentId);
  }

  getChoices() {
    const line = this.getCurrentLine();
    return line?.choices || [];
  }

  advance(choiceIndex) {
    const line = this.getCurrentLine();
    if (!line) return;

    let nextId = null;

    if (line.choices && line.choices.length > 0) {
      if (choiceIndex === undefined || choiceIndex === null) return;
      const choice = line.choices[choiceIndex];
      if (!choice) return;
      nextId = choice.next;
    } else if (line.next) {
      nextId = line.next;
    } else {
      // Terminal line — apply its own flag before completing
      this._applyFlag(line);
      this.onSceneComplete();
      return;
    }

    if (!nextId) {
      this._applyFlag(line);
      this.onSceneComplete();
      return;
    }

    const nextLine = this.getLine(nextId);
    if (!nextLine) {
      console.error(`[DialogueEngine] Line not found: ${nextId}`);
      this.onSceneComplete();
      return;
    }

    this._applyFlag(line);
    this.currentId = nextId;
    this._fireTriggerForLine(nextLine);
  }

  _applyFlag(line) {
    if (!line.setsFlag) return;
    if (typeof line.setsFlag === 'string') {
      FLAGS[line.setsFlag] = true;
      this.onFlagSet(line.setsFlag, true);
    } else if (typeof line.setsFlag === 'object') {
      Object.entries(line.setsFlag).forEach(([key, val]) => {
        FLAGS[key] = val;
        this.onFlagSet(key, val);
      });
    }
  }

  _fireTriggerForLine(line) {
    if (line?.trigger) {
      console.log(`TRIGGER: ${line.trigger}`);
      this.onTrigger(line.trigger, line.id);
    }
  }

  reset(tree) {
    this.tree = tree;
    this.currentId = tree.startId;
    this._fireTriggerForLine(this.getLine(this.currentId));
  }
}
