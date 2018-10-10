import Editor from './core';
import Renderer from './renderer';

import Hypergen from './modules/hypergen';
import Markdown from './modules/markdown';
import Toolbar from './modules/toolbar';
import History from './modules/history';
import AutoSave from './modules/autosave';

import './styles/index.scss';

Editor.Renderer = Renderer;

Editor.module('hypergen', Hypergen);
Editor.module('markdown', Markdown);
Editor.module('toolbar', Toolbar);
Editor.module('history', History);
Editor.module('autosave', AutoSave);

export default Editor;
