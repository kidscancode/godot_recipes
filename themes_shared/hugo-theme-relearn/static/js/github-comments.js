// use of ajax vs getJSON for headers use to get markdown (body vs body_htmml)
// todo: pages, configure issue url, open in new window?

var CurrentPage = 0;

function ParseLinkHeader(link) {
    var entries = link.split(",");
    var links = {};
    for (var i in entries) {
        var entry = entries[i];
        var link = {};
        link.name = entry.match(/rel=\"([^\"]*)/)[1];
        link.url = entry.match(/<([^>]*)/)[1];
        link.page = entry.match(/page=(\d+).*$/)[1];
        links[link.name] = link;
    }
    return links;
}

function DoGithubComments(comment_id, page_id) {
    var repo_name = "kidscancode/godot_recipes";

    if (page_id === undefined)
        page_id = 1;

    var api_url = "https://api.github.com/repos/" + repo_name;
    var api_issue_url = api_url + "/issues/" + comment_id;
    var api_comments_url = api_url + "/issues/" + comment_id + "/comments" + "?page=" + page_id;

    var url = "https://github.com/kidscancode/godot_recipes/issues/" + comment_id;

    $(document).ready(function () {
        $.getJSON(api_issue_url, function (data) {
            NbComments = data.comments;
        });

        $.ajax(api_comments_url, {
            headers: { Accept: "application/vnd.github.v3.html+json" },
            dataType: "json",
            success: function (comments, textStatus, jqXHR) {

                // Add post button to first page
                if (page_id == 1)
                    $("#gh-comments-list").append("<a href='" + url + "#new_comment_field' rel='nofollow' class='button-gh'>Post a comment on Github</a>");

                // Individual comments
                $.each(comments, function (i, comment) {

                    var date = new Date(comment.created_at);

                    var t = "<div id='gh-comment'>";
                    t += "<img src='" + comment.user.avatar_url + "' width='24px'>";
                    t += "<b><a href='" + comment.user.html_url + "'>" + comment.user.login + "</a></b>";
                    t += " posted on ";
                    t += "<em>" + date.toUTCString() + "</em>";
                    t += "<div id='gh-comment-hr'></div>";
                    t += comment.body_html;
                    t += "</div>";
                    $("#gh-comments-list").append(t);
                });

                // Setup comments button if there are more pages to display
                var links = ParseLinkHeader(jqXHR.getResponseHeader("Link"));
                if ("next" in links) {
                    $("#gh-load-comments").attr("onclick", "DoGithubComments(" + comment_id + "," + (page_id + 1) + ");");
                    $("#gh-load-comments").show();
                }
                else {
                    $("#gh-load-comments").hide();
                }
            },
            error: function (xhr) {
                $("#gh-comments-list").append("Comments are not open for this post yet. " + xhr.status);
            }
        });
    });
}