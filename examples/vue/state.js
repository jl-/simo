export default {
    nodes: [{
        type: 'heading',
        meta: { level: 1 },
        nodes: [{
            type: 'text',
            text: 'Simo'
        }]
    }, {
        type: 'blockquote',
        nodes: [{
            type: 'text',
            text: 'Next '
        }, {
            type: 'text',
            text: 'semantic',
            formats: ['bold']
        }, {
            type: 'text',
            text: ' rich text',
            formats: ['bold', 'italic']
        }, {
            type: 'text',
            text: ' editor.'
        }]
    }, {
        type: 'heading',
        meta: { level: 2 },
        nodes: [{
            type: 'text',
            text: 'Features'
        }]
    }, {
        type: 'list',
        meta: { ordered: false },
        nodes: [{
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'no '
            }, {
                type: 'code',
                text: 'document.execCommand'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'code',
                text: 'state'
            }, {
                type: 'text',
                text: ' → '
            }, {
                type: 'code',
                text: 'renderer'
            }, {
                type: 'text',
                text: ' mechanism.'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'driven by user-defined '
            }, {
                type: 'code',
                text: 'schema'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'flexible yet lightweight '
            }, {
                type: 'text',
                text: 'plugin/module',
                formats: ['bold']
            }, {
                type: 'text',
                text: ' system'
            }]
        }]
    }, {
        type: 'heading',
        meta: { level: 2 },
        nodes: [{
            type: 'text',
            text: 'TODO'
        }]
    }, {
        type: 'list',
        nodes: [{
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'History/Autosave support'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'Copy/Past support'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'Delete/Backspace/Enter improvement'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'Task List'
            }]
        }]
    }, {
        type: 'heading',
        meta: { level: 2 },
        nodes: [{
            type: 'text',
            text: 'About this demo'
        }]
    }, {
        type: 'list',
        nodes: [{
            type: 'li',
            nodes: [{
                type: 'block',
                nodes: [{
                    type: 'text',
                    text: 'include a markdown module, with following features supported'
                }]
            }, {
                type: 'list',
                nodes: [{
                    type: 'li',
                    nodes: [{
                        type: 'text',
                        text: 'blockquote '
                    }, {
                        type: 'code',
                        text: '/^> /'
                    }]
                }, {
                    type: 'li',
                    nodes: [{
                        type: 'text',
                        text: 'heading '
                    }, {
                        type: 'code',
                        text: '/^#{1,6} /'
                    }]
                }, {
                    type: 'li',
                    nodes: [{
                        type: 'text',
                        text: 'li '
                    }, {
                        type: 'code',
                        text: '/^(^|1\.) /'
                    }]
                }]
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'text',
                text: 'editor instance exposed as: '
            }, {
                type: 'code',
                text: 'window.editor'
            }, {
                type: 'text',
                text: ', feel free to open console and inspect it'
            }]
        }, {
            type: 'li',
            nodes: [{
                type: 'block',
                nodes: [{
                    type: 'text',
                    text: 'editable code block'
                }]
            }, {
                type: 'code',
                text: "import Editor from 'simo/core';\nimport Renderer from 'simo/renderer';\nimport Hypergen from 'simo/modules/hypergen';\nimport Markdown from 'simo/modules/markdown';\n\nconst editor = new Editor({...});\nconst renderer = new Renderer('#editor', editor);\neditor.module('hypergen', Hypergen[, options]);\neditor.module('markdown', Markdown[, options]);\n\neditor.mount(renderer, {/* init state */});",
                meta: { inline: false, language: 'javascript' }
            }]
        }]
    }]
};
