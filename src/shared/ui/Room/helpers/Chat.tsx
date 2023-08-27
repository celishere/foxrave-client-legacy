import styles from "foxrave/shared/assets/css/Chat.module.css";

const Chat = () => {
    return (
        <div className={ styles.chatFrame }>
            <div className={ styles.chatContainer }>
                <div className={ styles.chatContainer }>
                    <div className={ styles.chatContainerView }>
                        <div className={ styles.chatContainerDisplay }>
                            <div className={ styles.header }>
                                hi
                            </div>

                            <div className={ styles.chatHistoryContainer }>
                                <div key={1} className={ styles.message }>
                                    <img src={ "http://localhost:4242/api/v1/storage/avatar/1" } alt="User Avatar" className={ styles.avatar } />

                                    <div className={ styles.messageInfo }>
                                        <div className={ styles.username }>
                                            <span>{ "agfaf" }</span>
                                            <img src={ "afffa" } alt="Emoticon" className={ styles['emoticon'] }/>
                                            <time data-variant="caption" data-color="gray" title=""
                                                  className={ styles['time'] }>{ "afafaf" }
                                            </time>
                                        </div>

                                        <div key={'afaafaf'} onClick={() => console.log('afafafafaf')}>
                                            <p className={ styles['message-text'] }>
                                                {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus sapien vel sapien pellentesque, sit amet viverra velit fringilla. Duis lacus orci, fringilla ac consequat a, fermentum nec lacus. Cras accumsan metus nec ligula sollicitudin semper. Sed vehicula nulla a suscipit porta. Maecenas ut mollis felis. Mauris a sollicitudin ipsum. Mauris ullamcorper, massa nec dignissim elementum, justo velit commodo nisl, ut tristique est nisl sagittis nisi. Etiam commodo velit eget nibh dictum cursus. Ut volutpat purus in purus finibus, vitae ultricies sem pellentesque. Vestibulum mattis nulla nibh, in interdum felis sollicitudin ac.\n" +
                                                    "\n" +
                                                    "Curabitur tempor posuere molestie. Vestibulum sed condimentum ex. Ut pharetra volutpat posuere. Aenean mollis finibus tempor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer porttitor dapibus imperdiet. Aliquam erat volutpat. Donec in erat eget est ullamcorper venenatis. Donec bibendum diam et semper tristique. Praesent blandit enim erat, nec auctor arcu dignissim in. Mauris rutrum neque quis dictum feugiat. Curabitur sagittis mauris nisl, sit amet viverra ligula tempus eget. Suspendisse aliquet ornare odio.\n" +
                                                    "\n" +
                                                    "Ut pulvinar, orci at fringilla semper, metus nulla scelerisque nulla, quis cursus eros erat sed mi. Sed molestie ac justo quis condimentum. Proin consequat ut ligula at feugiat. Nunc rhoncus interdum ante, id congue risus gravida in. Nulla dolor nulla, aliquam ac tempor vitae, laoreet varius quam. Fusce iaculis egestas ultrices. Nunc ullamcorper nulla ac urna dictum vulputate. Nulla non lacus in tellus euismod lobortis non nec nibh. Aenean ac dapibus sapien. Phasellus faucibus augue a pretium aliquet. Suspendisse quis tincidunt dolor, nec dapibus mauris. Aenean interdum sagittis tellus quis placerat.\n" +
                                                    "\n" +
                                                    "Donec a nisl sit amet risus placerat efficitur. Ut tempor felis eget nulla aliquet, vel porta erat consectetur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum eget consectetur libero. Nulla egestas est id purus sodales tempor. Mauris aliquet vestibulum tortor et lacinia. Ut tincidunt, sapien nec ultrices scelerisque, lectus metus faucibus magna, ac varius ante mi a erat. Pellentesque at dolor at ipsum condimentum varius in nec turpis.\n" +
                                                    "\n" +
                                                    "Proin aliquet ex pharetra risus pulvinar gravida sed id nisi. Suspendisse sit amet tellus vitae urna faucibus tincidunt commodo efficitur lectus. Sed aliquam justo eget felis pulvinar tristique a sed libero. Duis quis posuere velit. Suspendisse interdum facilisis nibh id sollicitudin. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec hendrerit neque sit amet turpis congue ornare."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;